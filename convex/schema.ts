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
});
