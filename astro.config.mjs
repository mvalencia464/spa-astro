import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  outDir: 'dist',
  compressHTML: true,
  adapter: cloudflare()
});