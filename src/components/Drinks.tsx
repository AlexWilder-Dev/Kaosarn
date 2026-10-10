import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './Drinks.module.css';

export function Drinks() {
  return (
    <section id="drinks" className={`section ${styles.drinks}`} aria-labelledby="drinks-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">BYOB &amp; bar</span>
          <h2 id="drinks-title" className="section-title">
            Bring a bottle. <span className="accent">Or don’t.</span>
          </h2>
        </header>

        <div className={styles.panels}>
          <Panel tone="byob" sign="BYOB" delay={0}>
            <h3>Bring your own</h3>
            <p>Got a bottle you love? Bring it along: wine, beer, whatever goes best with your green curry.</p>
            <p className={styles.note}>Small corkage fee</p>
          </Panel>

          <div className={styles.or} aria-hidden="true">
            or
          </div>

          <Panel tone="bar" sign="BAR" delay={0.12}>
            <h3>Use our bar</h3>
            <p>Travelling light? We’re fully licensed, so there’s always something cold waiting.</p>
            <ul className={styles.list}>
              <li>Draught beer</li>
              <li>Wine</li>
              <li>Spirits</li>
            </ul>
          </Panel>
        </div>
      </div>
    </section>
  );
}

type PanelProps = { tone: 'byob' | 'bar'; sign: string; delay: number; children: ReactNode };

function Panel({ tone, sign, delay, children }: PanelProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={styles.panel}
      data-tone={tone}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -4 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ type: 'spring', stiffness: 110, damping: 16, delay }}
    >
      <p className={styles.sign} aria-hidden="true">
        {sign}
      </p>
      <div className={styles.body}>{children}</div>
    </motion.article>
  );
}
