// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_BASE_URL / BASE_PATH are set by the GitHub Pages workflow (see README).
const site = process.env.SITE_BASE_URL ?? 'https://slphotography.com';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
