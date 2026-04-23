# Convex Product Database

This project now stores spa data in Convex with two tables:

- `products`: one document per spa model.
- `productImages`: image rows with `imageName`, public `imageUrl`, and `r2Key`.
- `stores`: one document per hot tub store/dealer website.
- `storeProductOverrides`: per-store visibility, featured flags, and pricing/image overrides.

## What was seeded

Seed data comes from `src/data/spaProducts.ts` and `image_names.txt` and includes:

- 9 products
- 981 product image records (63 product-gallery rows + 918 R2 inventory rows)

## Useful commands

```bash
npm run convex:dev
npm run convex:seed
npm run convex:deploy
```

You can query with:

```bash
npx convex run products:listProducts
npx convex run products:getProductBySlug '{"slug":"bimini"}'
npx convex run products:getImagesByProduct '{"productSlug":"bimini"}'
```

## Manual Testing Cheat Sheet

Use this when you want to quickly test Convex data/code changes by hand.

### 1) Start local app + Convex watcher

In terminal A:

```bash
npm run dev
```

In terminal B:

```bash
npm run convex:dev
```

This gives you fast feedback while editing `src/` and `convex/`.

### 2) Push Convex code changes (one-off)

If you changed files in `convex/` and want to push immediately:

```bash
npx convex run --deployment laudable-anaconda-147 products:listProducts "{}" --push
```

### 3) Re-seed products from local source file

If you edited `src/data/spaProducts.ts`, re-run seed:

```bash
npx convex run --deployment laudable-anaconda-147 products:seedProducts "{}" --push
```

### 4) Verify data quickly

List products:

```bash
npx convex run --deployment laudable-anaconda-147 products:listProducts "{}"
```

Check one product:

```bash
npx convex run --deployment laudable-anaconda-147 products:getProductBySlug '{"slug":"bimini"}'
```

Check product images:

```bash
npx convex run --deployment laudable-anaconda-147 products:getImagesByProduct '{"productSlug":"bimini"}'
```

### 5) Multi-store checks

Upsert store:

```bash
npx convex run --deployment laudable-anaconda-147 stores:upsertStore '{"slug":"boise","name":"Family Pool & Spa Boise","websiteUrl":"https://familypoolandspaid.com","city":"Boise","state":"ID","phone":"2089397665","active":true}'
```

Set per-store override:

```bash
npx convex run --deployment laudable-anaconda-147 stores:upsertStoreProductOverride '{"storeSlug":"boise","productSlug":"bimini","visible":true,"featured":true,"priceLabel":"From $12,999"}'
```

Get merged catalog:

```bash
npx convex run --deployment laudable-anaconda-147 stores:getStoreCatalog '{"storeSlug":"boise"}'
```

### 6) What requires a browser refresh?

- Data changes in Convex: refresh page to see updates.
- Code changes in `src/`: Astro dev server hot-reloads.
- `npm run build` is only needed for production/static build validation.

For multi-store setups:

```bash
npx convex run stores:upsertStore '{"slug":"boise","name":"Family Pool & Spa Boise","websiteUrl":"https://example.com","city":"Boise","state":"ID","phone":"2089397665","active":true}'
npx convex run stores:upsertStoreProductOverride '{"storeSlug":"boise","productSlug":"bimini","visible":true,"featured":true,"priceLabel":"From $12,999"}'
npx convex run stores:getStoreCatalog '{"storeSlug":"boise"}'
```
