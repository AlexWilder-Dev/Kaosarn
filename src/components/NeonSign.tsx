import { useId, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

// Single-stroke "glass tube" letters on a 56 × 80 grid.
const LETTERS: { char: string; d: string }[] = [
  { char: 'K', d: 'M6 4V76M50 4 12 40 50 76' },
  { char: 'A', d: 'M4 76 28 4 52 76M14 50H42' },
  { char: 'O', d: 'M28 4C44 4 52 18 52 40S44 76 28 76 4 62 4 40 12 4 28 4Z' },
  {
    char: 'S',
    d: 'M50 16C47 8 39 4 29 4 15 4 6 11 6 22S15 37 28 40C42 43 51 48 51 59S41 76 28 76C16 76 8 71 5 63',
  },
  { char: 'A', d: 'M4 76 28 4 52 76M14 50H42' },
  { char: 'R', d: 'M6 76V4H30C44 4 52 12 52 24S44 44 30 44H8M30 44 52 76' },
  { char: 'N', d: 'M6 76V4L50 76V4' },
];

const CELL = 56;
const GAP = 18;
const WIDTH = LETTERS.length * CELL + (LETTERS.length - 1) * GAP;
const PAD = 26;

// Order the tubes strike up in, and the one with a dodgy transformer.
const DELAYS = [0.15, 0.55, 0.3, 0.8, 0.45, 0.95, 0.65];
const FAULTY = 5;

const tube: Variants = {
  off: { opacity: 0 },
  on: (i: number) => ({
    opacity: [0, 1, 0.1, 0.9, 0.25, 1],
    transition: { duration: 1.1, delay: DELAYS[i], times: [0, 0.08, 0.16, 0.32, 0.44, 1], ease: 'linear' },
  }),
  buzz: {
    opacity: [1, 0.2, 1, 0.5, 0.9, 1, 1],
    transition: {
      duration: 4.2,
      times: [0, 0.015, 0.03, 0.05, 0.07, 0.09, 1],
      repeat: Infinity,
      repeatDelay: 2.5,
      ease: 'linear',
    },
  },
  lit: { opacity: 1 },
};

type Props = {
  /** Start the power-on sequence. */
  play?: boolean;
  className?: string;
  label?: string;
};

export function NeonSign({ play = true, className, label = 'Kaosarn' }: Props) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const [buzzing, setBuzzing] = useState(false);

  const stateFor = (i: number) => {
    if (reduce) return 'lit';
    if (!play) return 'off';
    if (i === FAULTY && buzzing) return 'buzz';
    return 'on';
  };

  const letters = LETTERS.map((l, i) => ({ ...l, x: i * (CELL + GAP) }));

  return (
    <svg
      className={className}
      viewBox={`${-PAD} ${-PAD} ${WIDTH + PAD * 2} ${80 + PAD * 2}`}
      role="img"
      aria-label={label}
    >
      <defs>
        <filter id={`${id}-glow`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="near" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="far" />
          <feMerge>
            <feMergeNode in="far" />
            <feMergeNode in="near" />
          </feMerge>
        </filter>
      </defs>

      {/* Unlit glass: visible before the sign powers up */}
      <g fill="none" stroke="rgba(255, 196, 220, 0.14)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {letters.map((l, i) => (
          <path key={i} d={l.d} transform={`translate(${l.x} 0)`} />
        ))}
      </g>

      {/* Glow */}
      <g
        filter={`url(#${id}-glow)`}
        fill="none"
        stroke="var(--pink)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {letters.map((l, i) => (
          <motion.path
            key={i}
            d={l.d}
            transform={`translate(${l.x} 0)`}
            custom={i}
            variants={tube}
            initial={reduce ? 'lit' : 'off'}
            animate={stateFor(i)}
          />
        ))}
      </g>

      {/* Hot core of the tube */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {letters.map((l, i) => (
          <motion.g
            key={i}
            transform={`translate(${l.x} 0)`}
            custom={i}
            variants={tube}
            initial={reduce ? 'lit' : 'off'}
            animate={stateFor(i)}
            onAnimationComplete={(def) => {
              if (i === FAULTY && def === 'on') setBuzzing(true);
            }}
          >
            <path d={l.d} stroke="var(--pink-hot)" strokeWidth="6.5" />
            <path d={l.d} stroke="var(--pink-core)" strokeWidth="2.6" />
          </motion.g>
        ))}
      </g>
    </svg>
  );
}
