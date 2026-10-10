import type { PointerEvent, ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import styles from './Drinks.module.css';

export function Drinks() {
  return (
    <section id="drinks" className={`section ${styles.drinks}`} aria-labelledby="drinks-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">BYOB &amp; bar</span>
          <h2 id="drinks-title" className="section-title">
            Bring a bottle. <span className="neon-lime">Or don’t.</span>
          </h2>
        </header>

        <div className={styles.panels}>
          <Panel tone="lime" sign="BYOB" art={<BottleBag />}>
            <h3>Bring your own</h3>
            <p>Got a bottle you love? Bring it along: wine, beer, whatever goes best with your green curry.</p>
            <p className={styles.note}>Small corkage fee</p>
          </Panel>

          <div className={styles.or} aria-hidden="true">
            or
          </div>

          <Panel tone="pink" sign="BAR" art={<Pint />}>
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

type PanelProps = { tone: 'lime' | 'pink'; sign: string; art: ReactNode; children: ReactNode };

function Panel({ tone, sign, art, children }: PanelProps) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 18 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      className={styles.panel}
      data-tone={tone}
      style={{ rotateX, rotateY }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
    >
      <div className={styles.top}>
        <motion.p
          className={styles.sign}
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0.15 }}
          whileInView={reduce ? undefined : { opacity: [0.15, 1, 0.3, 1, 0.6, 1] }}
          viewport={{ once: true, margin: '0px 0px -25% 0px' }}
          transition={{ duration: 1, times: [0, 0.1, 0.2, 0.35, 0.45, 1], delay: 0.3 }}
        >
          {sign}
        </motion.p>
        <div className={styles.art}>{art}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </motion.article>
  );
}

function BottleBag() {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <g className={styles.bottle}>
          <path d="M54 8h14v8M54 16h14l2 30H52Z" />
          <path d="M57 26h8" opacity=".6" />
        </g>
        <path d="M26 58l8-12 10 8 9-10 9 10 10-9 9 8 9-6 4 13" />
        <path d="M24 58h74l8 84H16Z" />
        <path d="M40 80h42M44 96h32" opacity=".5" />
      </g>
    </svg>
  );
}

function Pint() {
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 34h68l-8 106H34Z" />
        <path d="M24 34c0-12 10-18 20-14 4-10 22-10 26 0 10-6 26-2 26 14" />
        <path d="M28 52h64" opacity=".55" />
      </g>
      <g fill="currentColor" className={styles.bubbles}>
        <circle cx="48" cy="120" r="2.6" />
        <circle cx="62" cy="128" r="2" />
        <circle cx="72" cy="114" r="2.4" />
        <circle cx="55" cy="100" r="1.8" />
        <circle cx="68" cy="92" r="2.2" />
      </g>
    </svg>
  );
}
