import { useState, type CSSProperties } from 'react';
import { getPhoto, photoUrl, type PhotoSlot } from '../data/photos';
import styles from './Photo.module.css';

type Props = {
  slot: PhotoSlot;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  /** CSS object-position, to keep the subject in frame when cropped. */
  focus?: string;
};

/** Responsive, lazy-loaded WebP photo from public/photos/. */
export function Photo({ slot, alt, sizes, priority, className, style, focus }: Props) {
  const entry = getPhoto(slot);
  const [loaded, setLoaded] = useState(false);
  if (!entry) return null;

  const srcSet = entry.widths.map((w) => `${photoUrl(slot, w)} ${w}w`).join(', ');
  const fallbackWidth = entry.widths.find((w) => w >= 960) ?? entry.widths[entry.widths.length - 1];

  return (
    <div className={`${styles.frame} ${className ?? ''}`} style={style}>
      <img
        className={styles.img}
        data-loaded={loaded}
        src={photoUrl(slot, fallbackWidth)}
        srcSet={srcSet}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        style={focus ? { objectPosition: focus } : undefined}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
