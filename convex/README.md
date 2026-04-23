# Convex Product Database

This project stores spa data in Convex with two tables:

- `products`: one document per spa model.
- `productImages`: image rows with `imageName`, public `imageUrl`, and `r2Key`.

## What was seeded

Seed data comes from `src/data/spaProducts.ts` and includes:

- 3 products
- product image rows from each product gallery

## Useful commands

```bash
npm run convex:dev
npm run convex:codegen
npm run convex:seed
npm run convex:reset
npm run convex:deploy
```

You can query with:

```bash
npx convex run products:listProducts
npx convex run products:getProductBySlug '{"slug":"bimini"}'
npx convex run products:getImagesByProduct '{"productSlug":"bimini"}'
npx convex run products:resetProducts
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

### 5) What requires a browser refresh?

- Data changes in Convex: refresh page to see updates.
- Code changes in `src/`: Astro dev server hot-reloads.
- `npm run build` is only needed for production/static build validation.
