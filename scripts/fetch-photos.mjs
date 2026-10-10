#!/usr/bin/env node
// Downloads the restaurant's photos into photos/original/, converts them to
// responsive WebP files in public/photos/ and writes src/data/photo-manifest.json.
//
//   npm run photos            download anything missing, convert anything missing
//   npm run photos -- --force re-convert everything (after changing a slot below)
//
// Already have the files? Drop them into photos/original/ using the media id as
// the file name (e.g. 929758_2d35c2f8983546f59793852ee841d32e~mv2.jpg) and run
// the script; nothing will be downloaded.

import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS = join(root, 'photos', 'original');
const OUTPUT = join(root, 'public', 'photos');
const MANIFEST = join(root, 'src', 'data', 'photo-manifest.json');

const MEDIA_BASE = 'https://static.wixstatic.com/media/';
const LIVE_SITE = 'https://www.kaosarntooting.co.uk/';

// Which photo fills which slot on the page. Swap ids here and re-run with --force.
const PHOTOS = [
  { slot: 'hero', id: '929758_aaace066f52646e99d9fb10dd568e10d~mv2.jpg' }, // salads on enamel plates
  { slot: 'story', id: '929758_2d35c2f8983546f59793852ee841d32e~mv2.jpg' }, // dining room, Thai name sign
  { slot: 'groups', id: '929758_c0e76ce242204245b111f02150dcf2dc~mv2.jpeg' }, // main room, open kitchen
  { slot: 'visit', id: '929758_47f39fc5703f48d1a103134674d47323~mv2.jpeg' }, // banquette corner
  { slot: 'menu', id: '929758_c1482b7a70a74134aa75dd64847c7219~mv2.jpg' }, // sharing spread (787px wide)
];

const WIDTHS = [480, 960, 1600, 2400];
const force = process.argv.includes('--force');

let liveHtml;
async function liveSiteCandidates(id) {
  liveHtml ??= await fetch(LIVE_SITE).then((r) => (r.ok ? r.text() : ''));
  const stem = id.replace(/\.[a-z]+$/i, '');
  const pattern = new RegExp(`https://static\\.wixstatic\\.com/media/${stem}[^"'\\s)]*`, 'g');
  const found = [...new Set(liveHtml.match(pattern) ?? [])].map((u) => u.replace(/&amp;/g, '&'));
  // Prefer the largest rendition referenced by the page.
  const size = (u) => {
    const m = u.match(/w_(\d+),h_(\d+)/);
    return m ? Number(m[1]) * Number(m[2]) : 0;
  };
  return found.sort((a, b) => size(b) - size(a));
}

async function download(url) {
  const res = await fetch(url);
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.startsWith('image/')) throw new Error(`${res.status} ${type || 'no content type'}`);
  return Buffer.from(await res.arrayBuffer());
}

async function ensureOriginal({ id }) {
  const file = join(ORIGINALS, id);
  if (existsSync(file)) return file;

  const attempts = [MEDIA_BASE + id];
  try {
    attempts.push(...(await liveSiteCandidates(id)));
  } catch (err) {
    console.warn(`  could not read ${LIVE_SITE}: ${err.message}`);
  }

  for (const url of attempts) {
    try {
      const buf = await download(url);
      await writeFile(file, buf);
      console.log(`  downloaded ${id} (${Math.round(buf.length / 1024)} KB)`);
      return file;
    } catch (err) {
      console.warn(`  ${url} → ${err.message}`);
    }
  }
  throw new Error(`Could not download ${id}`);
}

async function convert(slot, file) {
  const image = sharp(file).rotate();
  const { width, height } = await image.metadata();
  const { dominant } = await sharp(file).stats();
  const color = `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`;

  const widths = WIDTHS.filter((w) => w < width);
  if (!widths.length || widths.at(-1) < width) widths.push(Math.min(width, 3000));

  for (const w of widths) {
    const out = join(OUTPUT, `${slot}-${w}.webp`);
    if (!force && existsSync(out)) continue;
    await sharp(file).rotate().resize({ width: w }).webp({ quality: 72, effort: 6 }).toFile(out);
    const { size } = await stat(out);
    console.log(`  ${slot}-${w}.webp (${Math.round(size / 1024)} KB)`);
  }

  const ratio = height / width;
  return { width: widths.at(-1), height: Math.round(widths.at(-1) * ratio), color, widths };
}

async function main() {
  await mkdir(ORIGINALS, { recursive: true });
  await mkdir(OUTPUT, { recursive: true });

  const manifest = {};
  const failed = [];

  for (const photo of PHOTOS) {
    console.log(`${photo.slot}: ${photo.id}`);
    try {
      const file = await ensureOriginal(photo);
      manifest[photo.slot] = await convert(photo.slot, file);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      failed.push(photo.slot);
    }
  }

  const previous = existsSync(MANIFEST) ? await readFile(MANIFEST, 'utf8') : '';
  const next = JSON.stringify(manifest, null, 2) + '\n';
  if (previous !== next) await writeFile(MANIFEST, next);

  if (failed.length) {
    console.error(`\nMissing photos for: ${failed.join(', ')}. Those slots will show artwork instead.`);
    process.exit(1);
  }
  console.log('\nAll photos ready.');
}

main();
