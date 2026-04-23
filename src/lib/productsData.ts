import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { SpaProduct } from "../data/spaProducts";

type ConvexProductDoc = {
  slug: string;
  name: string;
  series: string;
  model: string;
  startingPrice: string;
  heroAlt: string;
  heroImage?: string;
  gallery: string[];
  quickSpecs: {
    seats: string;
    jets: string;
    dimensions: string;
    gallons: string;
  };
  data?: Partial<Omit<SpaProduct, "slug" | "name" | "series" | "model" | "startingPrice" | "heroAlt" | "heroImage" | "gallery" | "quickSpecs">>;
};

const CONVEX_URL = import.meta.env.CONVEX_URL;
const IS_DEV = import.meta.env.DEV;

let cachedProducts: SpaProduct[] | null = null;

function normalizeProduct(doc: ConvexProductDoc): SpaProduct {
  return {
    slug: doc.slug,
    name: doc.name,
    series: doc.series,
    model: doc.model,
    startingPrice: doc.startingPrice,
    heroAlt: doc.heroAlt,
    heroImage: doc.heroImage,
    gallery: doc.gallery ?? [],
    quickSpecs: doc.quickSpecs,
    features: doc.data?.features ?? [],
    signature:
      doc.data?.signature ?? {
        title: "",
        description: "",
        stats: [],
        image: doc.gallery?.[0] ?? "",
      },
    specSections: doc.data?.specSections ?? [],
    specDiagramLabel: doc.data?.specDiagramLabel ?? "",
    specHighlights: doc.data?.specHighlights ?? [],
    shellColors: doc.data?.shellColors ?? [],
    cabinetColors: doc.data?.cabinetColors ?? [],
    related: doc.data?.related ?? [],
  };
}

export async function getSpaProducts(): Promise<SpaProduct[]> {
  if (!IS_DEV && cachedProducts) return cachedProducts;
  if (!CONVEX_URL) {
    throw new Error("Missing CONVEX_URL. Configure it to load spa products.");
  }

  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    const docs = (await client.query(api.products.listProducts, {})) as ConvexProductDoc[];
    const normalized = docs.map(normalizeProduct);
    if (!IS_DEV) cachedProducts = normalized;
    return normalized;
  } catch (error) {
    throw new Error(
      `Failed to load products from Convex: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }
}

export async function getSpaProductBySlug(slug: string): Promise<SpaProduct | undefined> {
  const products = await getSpaProducts();
  return products.find((product) => product.slug === slug);
}
