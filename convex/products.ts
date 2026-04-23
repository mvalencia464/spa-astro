import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { spaProducts } from "../src/data/spaProducts";

function parseImage(url: string) {
  let imageName = url;
  let r2Key = url;
  let format = "unknown";

  try {
    const parsed = new URL(url);
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    imageName = key.split("/").pop() ?? key;
    r2Key = key;
    format = imageName.split(".").pop()?.toLowerCase() ?? "unknown";
  } catch {
    // Keep safe fallbacks for malformed URLs.
  }

  return { imageName, r2Key, format };
}

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getProductBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getImagesByProduct = query({
  args: { productSlug: v.string() },
  handler: async (ctx, { productSlug }) => {
    return await ctx.db
      .query("productImages")
      .withIndex("by_productSlug", (q) => q.eq("productSlug", productSlug))
      .collect();
  },
});

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    return await upsertSeedProducts(ctx);
  },
});

async function upsertSeedProducts(ctx: MutationCtx) {
  const insertedProducts: string[] = [];
  const touchedImages = new Set<string>();

  for (const product of spaProducts) {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", product.slug))
      .first();

    const payload = {
      slug: product.slug,
      name: product.name,
      series: product.series,
      model: product.model,
      startingPrice: product.startingPrice,
      heroAlt: product.heroAlt,
      heroImage: product.heroImage,
      gallery: product.gallery,
      quickSpecs: product.quickSpecs,
      data: {
        features: product.features,
        signature: product.signature,
        specSections: product.specSections,
        specDiagramLabel: product.specDiagramLabel,
        specHighlights: product.specHighlights,
        shellColors: product.shellColors,
        cabinetColors: product.cabinetColors,
        related: product.related,
      },
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
    } else {
      await ctx.db.insert("products", payload);
    }
    insertedProducts.push(product.slug);

    for (const imageUrl of product.gallery) {
      const { imageName, r2Key, format } = parseImage(imageUrl);
      const imageFingerprint = `${product.slug}|${imageUrl}`;
      if (touchedImages.has(imageFingerprint)) continue;
      touchedImages.add(imageFingerprint);

      const existingImage = await ctx.db
        .query("productImages")
        .withIndex("by_productSlug", (q) => q.eq("productSlug", product.slug))
        .filter((q) => q.eq(q.field("imageUrl"), imageUrl))
        .first();

      const imagePayload = {
        productSlug: product.slug,
        imageName,
        imageUrl,
        r2Key,
        format,
      };

      if (existingImage) {
        await ctx.db.patch(existingImage._id, imagePayload);
      } else {
        await ctx.db.insert("productImages", imagePayload);
      }
    }
  }

  return {
    productCount: insertedProducts.length,
    imageCount: touchedImages.size,
    slugs: insertedProducts,
  };
}

export const resetProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const images = await ctx.db.query("productImages").collect();

    for (const doc of images) {
      await ctx.db.delete(doc._id);
    }
    for (const doc of products) {
      await ctx.db.delete(doc._id);
    }

    const seeded = await upsertSeedProducts(ctx);
    return {
      clearedProducts: products.length,
      clearedImages: images.length,
      ...seeded,
    };
  },
});
