import styles from './Marquee.module.css';

type Props = { items: string[]; tone?: 'mango' | 'pink' | 'lime'; tilt?: number; reverse?: boolean };

/** Hand-painted banner that scrolls sideways. Decorative: the same words appear elsewhere on the page. */
export function Marquee({ items, tone = 'mango', tilt = -2, reverse }: Props) {
  const run = [...items, ...items];
  return (
    <div className={styles.band} data-tone={tone} style={{ rotate: `${tilt}deg` }} aria-hidden="true">
      <div className={styles.track} data-reverse={reverse}>
        {[0, 1].map((copy) => (
          <span key={copy} className={styles.group}>
            {run.map((item, i) => (
              <span key={i} className={styles.item}>
                {item}
                <span className={styles.sep}>✺</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
