import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertStore = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    websiteUrl: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    phone: v.optional(v.string()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }

    return await ctx.db.insert("stores", args);
  },
});

export const upsertStoreProductOverride = mutation({
  args: {
    storeSlug: v.string(),
    productSlug: v.string(),
    visible: v.boolean(),
    featured: v.boolean(),
    priceLabel: v.optional(v.string()),
    notes: v.optional(v.string()),
    heroImageOverride: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", args.storeSlug))
      .first();

    if (!store) {
      throw new Error(`Store not found for slug: ${args.storeSlug}`);
    }

    const existing = await ctx.db
      .query("storeProductOverrides")
      .withIndex("by_storeId_productSlug", (q) =>
        q.eq("storeId", store._id).eq("productSlug", args.productSlug),
      )
      .first();

    const payload = {
      storeId: store._id,
      productSlug: args.productSlug,
      visible: args.visible,
      featured: args.featured,
      priceLabel: args.priceLabel,
      notes: args.notes,
      heroImageOverride: args.heroImageOverride,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }

    return await ctx.db.insert("storeProductOverrides", payload);
  },
});

export const listStores = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stores").collect();
  },
});

export const getStoreCatalog = query({
  args: {
    storeSlug: v.string(),
  },
  handler: async (ctx, { storeSlug }) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_slug", (q) => q.eq("slug", storeSlug))
      .first();
    if (!store) return null;

    const products = await ctx.db.query("products").collect();
    const overrides = await ctx.db
      .query("storeProductOverrides")
      .withIndex("by_storeId", (q) => q.eq("storeId", store._id))
      .collect();

    const overrideByProductSlug = new Map(overrides.map((override) => [override.productSlug, override]));

    const catalog = products
      .map((product) => {
        const override = overrideByProductSlug.get(product.slug);
        return {
          ...product,
          storeOverride: override
            ? {
                visible: override.visible,
                featured: override.featured,
                priceLabel: override.priceLabel,
                notes: override.notes,
                heroImageOverride: override.heroImageOverride,
              }
            : null,
          effectivePriceLabel: override?.priceLabel ?? product.startingPrice,
          effectiveHeroImage: override?.heroImageOverride ?? product.heroImage ?? product.gallery[0] ?? "",
          visible: override ? override.visible : true,
          featured: override ? override.featured : false,
        };
      })
      .filter((product) => product.visible);

    return {
      store,
      products: catalog,
    };
  },
});
