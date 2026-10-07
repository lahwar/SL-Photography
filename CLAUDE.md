# SL Photography

Static photography portfolio for Sofiene Lahouar, built with **Astro** (static output) and deployed to GitHub Pages.

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve `dist/`
- `npm run check` — Astro/TypeScript type check

## Where things live
- `src/data/photos.ts` — **the portfolio**: every photo's title, alt text, chapter, place, layout hint. Add/remove/reorder photos here only.
- `src/data/chapters.ts` — the five chapters (Salt, Stone, Strangers, Ember, Green).
- `src/data/site.ts` — name, copy, social links.
- `src/photos/<chapter>/<nn>-<slug>.jpg` — original JPEGs (never served directly; Astro generates AVIF/WebP).
- `src/styles/tokens.css` — all colors, fonts, sizes, spacing. `global.css` — reset + utilities (`.container`, `.display`, `.mono`, `.reveal`, `.visually-hidden`).
- `src/components/` — one component per section; `src/scripts/` — client scripts (keep tiny).

## Rules
- Use tokens (`var(--…)`) — no raw hex values or font names in components.
- Spelling: **Sofiene Lahouar**. The site is a pure portfolio: no booking/sales copy, no contact form; contact = Instagram.
- Alt text describes what is actually in the frame. Only set `place` when certain.
- Never add `user-scalable=no` or `maximum-scale`. Respect `prefers-reduced-motion`.
- Zero JS by default; the lightbox is the only meaningful script. Budget: < 10 KB JS total.
- Both themes (paper / darkroom) must pass WCAG AA contrast. Lightbox is always dark.
- Do not edit `dist/`. Do not commit `.env`.
- Pin dependency versions exactly.
