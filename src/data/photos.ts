import manifest from './photo-manifest.json';

// Written by `npm run photos` (scripts/fetch-photos.mjs). Empty until the
// photos have been downloaded and converted; slots then fall back to artwork.
export type PhotoSlot = 'hero' | 'story' | 'menu' | 'groups' | 'visit';

export type PhotoEntry = {
  width: number;
  height: number;
  color: string;
  widths: number[];
};

const entries = manifest as Partial<Record<PhotoSlot, PhotoEntry>>;

export const getPhoto = (slot: PhotoSlot) => entries[slot];

export const hasPhoto = (slot: PhotoSlot) => Boolean(entries[slot]);

export const photoUrl = (slot: PhotoSlot, width: number) => `${import.meta.env.BASE_URL}photos/${slot}-${width}.webp`;
