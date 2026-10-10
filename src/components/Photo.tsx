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
  /** Artwork to draw if the photo is missing. Without it a missing photo renders nothing. */
  motif?: ArtMotif;
};

/** Responsive, lazy-loaded WebP photo. */
export function Photo({ slot, alt, sizes, priority, className, style, motif }: Props) {
  const entry = getPhoto(slot);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!entry || failed) {
    if (!motif) return null;
    return (
      <div className={`${styles.frame} ${className ?? ''}`} style={style}>
        <PhotoArt motif={motif} label={alt} />
      </div>
    );
  }

  const srcSet = entry.widths.map((w) => `${photoUrl(slot, w)} ${w}w`).join(', ');
  const fallbackWidth = entry.widths.find((w) => w >= 960) ?? entry.widths[entry.widths.length - 1];

  return (
    <div className={`${styles.frame} ${className ?? ''}`} style={{ backgroundColor: entry.color, ...style }}>
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
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export type ArtMotif = 'ambient' | 'bowl' | 'street';

/** Neon-tinted illustration used where a photo isn't available. */
export function PhotoArt({ motif, label }: { motif: ArtMotif; label?: string }) {
  return (
    <div className={styles.art} data-motif={motif} role={label ? 'img' : undefined} aria-label={label || undefined}>
      <svg className={styles.lights} viewBox="0 0 400 60" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <path d="M0 8Q100 48 200 8T400 8" fill="none" stroke="rgba(255,240,220,.25)" strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => {
          const x = 16 + i * 33.5;
          const u = (x % 200) / 200;
          const colors = ['var(--mango)', 'var(--pink)', 'var(--lime)'];
          return (
            <circle
              key={i}
              cx={x}
              cy={14 + 80 * u * (1 - u)}
              r="4.5"
              fill="currentColor"
              style={{ color: colors[i % 3] }}
              className={styles.bulb}
            />
          );
        })}
      </svg>

      {motif === 'bowl' && (
        <svg className={styles.motif} viewBox="0 0 200 160" aria-hidden="true">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              className={styles.steam}
              d="M78 58c-10-12 10-18 0-32M100 52c-10-12 10-18 0-32M122 58c-10-12 10-18 0-32"
              stroke="rgba(255,240,230,.5)"
              strokeWidth="4"
            />
            <path d="M30 80h140c0 34-31 58-70 58S30 114 30 80Z" stroke="var(--mango)" strokeWidth="6" />
            <path d="M118 46l52-30M126 54l56-24" stroke="var(--pink)" strokeWidth="5" />
          </g>
        </svg>
      )}
      {motif === 'street' && (
        <svg className={styles.motif} viewBox="0 0 200 160" aria-hidden="true">
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5">
            <rect x="34" y="40" width="132" height="70" rx="10" stroke="var(--lime)" />
            <path d="M58 64h84M58 86h52" stroke="var(--pink)" />
            <path d="M60 110v30M140 110v30" stroke="rgba(255,240,230,.4)" />
          </g>
        </svg>
      )}
    </div>
  );
}
