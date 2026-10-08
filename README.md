# SL Photography

A quiet, book-like photography portfolio for Sofiene Lahouar — five chapters, one lightbox, almost no JavaScript.

## Stack

[Astro](https://astro.build) (static output) with `astro:assets` (AVIF/WebP via sharp), plain CSS tokens, self-hosted fonts (Instrument Serif, Inter, IBM Plex Mono), deployed to GitHub Pages.

## Commands

```sh
npm install      # install dependencies
npm run dev      # local dev server
npm run build    # production build to dist/
npm run preview  # serve dist/
npm run check    # Astro/TypeScript type check
```

## Structure

```
src/data/photos.ts     the portfolio: every photo's title, alt text, place, layout hint
src/data/chapters.ts   the five chapters
src/data/site.ts       name, copy, social links
src/photos/<chapter>/  original JPEGs (never served directly)
src/styles/            tokens.css (all design tokens) + global.css (reset, utilities)
src/components/        one component per section
src/scripts/           client scripts (kept tiny; JS budget < 10 KB)
public/                favicon, robots.txt (and CNAME for a custom domain)
```

## How to add a photo

1. Drop the JPEG in `src/photos/<chapter>/NN-slug.jpg` (e.g. `src/photos/salt/07-low-tide.jpg`).
2. Add an entry for it in `src/data/photos.ts`, in the matching chapter, with a `title` and honest `alt` text that describes what is actually in the frame. Only set `place` when you are certain.

Frame numbers and order are automatic: a photo's position within its chapter's list is its order on the page.

## Chapters

Salt, Stone, Strangers, Ember, Green — defined in `src/data/chapters.ts`. Each photo belongs to exactly one.

## Theming

Light ("paper") and dark ("darkroom") themes follow the OS, and the header toggle saves the visitor's choice. Every color, font, size and space lives in `src/styles/tokens.css`; components use `var(--…)` only. Both themes must pass WCAG AA contrast. The lightbox is always dark.

## Deployment

Pushes to `main` (or `master`) run `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

1. In the repository, go to Settings → Pages → Source and choose **GitHub Actions**.
2. For a custom domain, add a `public/CNAME` file containing the domain and set it under Settings → Pages. The `Sitemap:` URL in `public/robots.txt` must match the site URL (`SITE_BASE_URL`).

### Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `SITE_BASE_URL` | Public origin, used for canonical URLs, Open Graph and the sitemap | `https://slphotography.com` |
| `BASE_PATH` | Path the site is served from (e.g. `/SL-Photography/` on a project page) | `/` |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Optional. If set, loads Plausible analytics for that domain | unset |

The workflow sets `SITE_BASE_URL` and `BASE_PATH` automatically from the Pages configuration.

## Privacy

Originals may carry EXIF metadata including GPS. The images Astro generates (AVIF/WebP/JPEG) have EXIF and GPS stripped, and the originals are never served.
