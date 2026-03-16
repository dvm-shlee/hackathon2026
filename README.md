# OHBM Brainhack Bordeaux 2026 Website

Official landing page for OHBM Brainhack 2026 (June 11-13, Bordeaux, France).

## Overview

This site includes:

- Hero section with animated neural-network visual
- Event info and venue highlight
- 3-day interactive schedule (tabbed timeline)
- HackTrack and TrainTrack registration sections backed by GitHub Issues
- Searchable project and tutorial listings on the home page
- Sponsor section + contact CTA
- Footer links and event metadata

The page is built as a static-exported Next.js app and deployed to GitHub Pages.

## Tech Stack

- Next.js `16.1.3` (App Router)
- React `19.2.3`
- TypeScript `5`
- Tailwind CSS `4`
- Radix UI + shadcn/ui
- Lucide React icons
- Vercel Analytics (`@vercel/analytics`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`: start dev server
- `npm run sync-tracks`: fetch HackTrack / TrainTrack issues and regenerate `src/data/tracks.generated.json`
- `npm run build`: production build + static export (`out/`)
- `npm run start`: run production server
- `npm run lint`: run ESLint

## Project Structure

- `src/app/layout.tsx`: metadata, fonts, global layout
- `src/app/page.tsx`: section composition order
- `src/app/globals.css`: theme tokens and base styling
- `src/components/hero-section.tsx`: hero + brain animation
- `src/components/info-section.tsx`: event highlights + venue visual
- `src/components/schedule-section.tsx`: schedule UI and schedule data
- `src/components/track-browser.tsx`: searchable HackTrack / TrainTrack browser UI
- `src/components/sponsors-section.tsx`: sponsor/CTA content
- `src/components/scroll-fade.tsx`: section entrance/exit scroll transitions
- `scripts/sync-track-issues.js`: GitHub issue parser and JSON generator
- `.github/ISSUE_TEMPLATE/*.yml`: registration forms for HackTrack and TrainTrack
- `schedule.md`: planning/reference schedule document (not auto-wired to UI)

## Content Update Guide

1. Event title/description (SEO): update `src/app/layout.tsx`.
2. Hero copy/date/location: update `src/components/hero-section.tsx`.
3. Schedule data and track tags: update `src/components/schedule-section.tsx`.
4. HackTrack / TrainTrack issue forms: update `.github/ISSUE_TEMPLATE/`.
5. Track parsing behavior: update `scripts/sync-track-issues.js`.
6. Sponsor entries and logo paths: update `src/components/sponsors-section.tsx` and add assets to `public/`.
7. Footer links/text: update `src/components/footer.tsx`.

Note: `schedule.md` is documentation for planning. The live schedule currently comes from the `schedule` object in `schedule-section.tsx`.

## HackTrack / TrainTrack Sync

HackTrack and TrainTrack are sourced from GitHub Issues in this repository.

- Opening, editing, labeling, unlabeled changes, reopening, or closing an issue triggers the GitHub Pages deployment workflow.
- The workflow runs `node scripts/sync-track-issues.js` before `next build`.
- The script parses the GitHub issue form bodies and regenerates `src/data/tracks.generated.json`.
- The website then rebuilds from that generated JSON. No manual JSON commit is required for new registrations to appear.

## Deployment (GitHub Pages)

Deployment runs via `.github/workflows/nextjs.yml` on pushes to `main`.

Static hosting settings are in `next.config.ts`:

- `output: "export"`
- `images.unoptimized: true`
- `basePath` / `assetPrefix` for repository subpath deployment

If the repository name changes, update `repositoryName` in `next.config.ts`.

## License

MIT
