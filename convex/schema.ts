import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    slug: v.string(),
    name: v.string(),
    series: v.string(),
    model: v.string(),
    startingPrice: v.string(),
    heroAlt: v.string(),
    heroImage: v.optional(v.string()),
    gallery: v.array(v.string()),
    quickSpecs: v.object({
      seats: v.string(),
      jets: v.string(),
      dimensions: v.string(),
      gallons: v.string(),
    }),
    data: v.any(),
  }).index("by_slug", ["slug"]),

  productImages: defineTable({
    productSlug: v.string(),
    imageName: v.string(),
    imageUrl: v.string(),
    r2Key: v.string(),
    format: v.string(),
  })
    .index("by_productSlug", ["productSlug"])
    .index("by_imageName", ["imageName"]),

  stores: defineTable({
    slug: v.string(),
    name: v.string(),
    websiteUrl: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    phone: v.optional(v.string()),
    active: v.boolean(),
  }).index("by_slug", ["slug"]),

  storeProductOverrides: defineTable({
    storeId: v.id("stores"),
    productSlug: v.string(),
    visible: v.boolean(),
    featured: v.boolean(),
    priceLabel: v.optional(v.string()),
    notes: v.optional(v.string()),
    heroImageOverride: v.optional(v.string()),
  })
    .index("by_storeId", ["storeId"])
    .index("by_storeId_productSlug", ["storeId", "productSlug"])
    .index("by_productSlug", ["productSlug"]),
});
