# Kaosarn Tooting

A demo website for Kaosarn, the Thai restaurant at 181 Tooting High Street, London SW17 0SZ.
Khaosan Road after dark: neon, street-food steam and tuk-tuk tail-lights, built mobile-first.

Static front end only. There's no CMS, database, payments, email or analytics, and the group enquiry
form doesn't send anything.

**Stack:** Vite · React · TypeScript · Framer Motion

## Run it locally

```bash
npm install
npm run photos   # first time only: downloads and converts the restaurant's photos
npm run dev      # http://localhost:5173/Kaosarn/
```

`npm run build` type-checks and builds to `dist/`; `npm run preview` serves that build.

## Photos

`npm run photos` downloads the restaurant's five photos into `photos/original/`, converts them to
responsive WebP files in `public/photos/` and writes `src/data/photo-manifest.json`. Commit all three
so every build has them.

- Which photo goes where is set at the top of `scripts/fetch-photos.mjs`. After changing it, run
  `npm run photos -- --force`.
- If a download fails, save the file into `photos/original/` under its media id
  (e.g. `929758_2d35c2f8983546f59793852ee841d32e~mv2.jpg`) and run the script again.
- Until a photo exists, the hero shows drawn artwork and the other photo slots stay hidden.

## Deploy to GitHub Pages

Every push to `main` (or the current working branch) deploys automatically through
`.github/workflows/deploy.yml`, with **Settings → Pages → Source** set to **GitHub Actions**. The workflow
fetches the photos, builds and publishes. It can also be run by hand from the Actions tab.

The site is served from `https://<user>.github.io/Kaosarn/`. If the repo is renamed, update `base` in
`vite.config.ts` to match.

To publish from your own machine instead, run `npm run deploy` and set the Pages source to
**Deploy from a branch → `gh-pages` / root**.

## Editing content

| What | Where |
| --- | --- |
| Menu, prices, dietary tags, spice and rice notes | `src/data/menu.ts` |
| Address, phone, email, booking link, ratings | `src/data/business.ts` |
| Opening hours (drives the live "Open now" pill) | `src/lib/hours.ts` |

Menu and prices come from the restaurant's Deliveroo listing (October 2026) and are shown as sample
prices.
