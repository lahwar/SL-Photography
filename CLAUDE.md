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

## Project state (as of 2026-10-11)
- The redesign ("Salt & Stone", a printed-photo-book look) is merged to `master` (PR #5) and **live on Cloudflare Pages**: https://sl-photography.lahwars.workers.dev/ — Cloudflare builds from `master` (`npm run build`, output `dist`, `NODE_VERSION=22`, `SITE_BASE_URL` = the live address).
- `.github/workflows/deploy.yml` (GitHub Pages) exists but is unused: the owner's GitHub Actions were blocked by an account billing lock. Cloudflare does not need it.
- 31 photos in 5 chapters (Salt, Stone, Strangers, Ember, Green). Titles are the photographer's own; the 7 newer titles, headline/chapter statements/closing line are drafts awaiting the owner's review. Add `place` only when certain.
- Open items: owner reviews the draft copy; two original JPEGs once had GPS EXIF (now stripped, but still in public git history — rewriting history needs the owner's explicit OK); a Dependabot PR for `sharp` may appear — test the build before merging (sharp produces every image).

## Adding photos (the usual task)
1. Get the original (the owner may attach images in chat, or point to a Google Drive folder — check which Drive account the connector is on before searching; if the folder is not found, say so instead of guessing).
2. Check pixel dimensions first. Aim for ~2400px on the long side, 1–3 MB; resize only if far larger.
3. **Strip EXIF/GPS from the original before committing** (the repo is public). Verify pixels are unchanged.
4. Save as `src/photos/<chapter>/NN-slug.jpg`, add one entry to `src/data/photos.ts` (title, honest alt text of what is in the frame, optional `place`, optional `feature: 'wide'`). A new chapter also needs an entry in `src/data/chapters.ts` and a tint token in `tokens.css` (both themes, AA contrast).
5. Show the owner the proposed titles/chapters before committing. Run `npm run build` and `npm run check`, then push a branch and open a PR; the owner merges and Cloudflare publishes.

## Gotchas learned
- Never read a property directly on an imported image (`photo.image.width`) in components — Astro then ships the original JPEG. Read dimensions via `image.clone`, as `Photo.astro` and `PhotoGrid.astro` do. Pass images only to `Picture`/`getImage`.
- sharp rejects percentage crop positions; `focal` is CSS-only.
- Images are AVIF with a WebP fallback (no JPEG copies) to keep `dist` ~38 MB.
- The grid is laid out at build time in justified rows (`PhotoGrid.astro`); `feature: 'wide'` gives a landscape photo its own row.
- Home-page scroll-reveal uses CSS scroll-driven animation; screenshots need `reducedMotion: 'reduce'` to show every photo.
- Subagent setup: `.claude/agents/` defines `gallery`, `site-shell` (builders) and `auditor` (read-only, Haiku). Give builders non-overlapping files and an explicit working directory. Playwright is installed globally (`/opt/node22/lib/node_modules`); Chromium is at `/opt/pw-browsers/chromium`.
