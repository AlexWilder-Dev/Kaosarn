import styles from './Ornament.module.css';

/** A lotus drawn in fine line, the flower that frames so much Thai decorative art. */
export function Lotus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 28" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
        <path d="M24 2C30 10 30 18 24 26 18 18 18 10 24 2Z" />
        <path d="M24 26C20 18 14.5 12.5 8.5 12 9 19 15 24 24 26ZM24 26C28 18 33.5 12.5 39.5 12 39 19 33 24 24 26Z" />
        <path d="M24 26C16.5 22 8.5 20.5 2 22.5 8 26.5 16 27.5 24 26ZM24 26C31.5 22 39.5 20.5 46 22.5 40 26.5 32 27.5 24 26Z" />
      </g>
    </svg>
  );
}

/** Hairline, lotus, hairline. */
export function Ornament({ className, tone = 'gold' }: { className?: string; tone?: 'gold' | 'ink' }) {
  return (
    <div className={`${styles.ornament} ${className ?? ''}`} data-tone={tone} aria-hidden="true">
      <span />
      <Lotus className={styles.lotus} />
      <span />
    </div>
  );
}
