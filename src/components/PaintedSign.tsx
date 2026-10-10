import { motion, useReducedMotion } from 'framer-motion';
import styles from './PaintedSign.module.css';

// Single-stroke sign-writer's capitals on a 56 × 80 grid, painted with a round brush.
const LETTERS = [
  'M6 4V76M50 4 12 40 50 76', // K
  'M4 76 28 4 52 76M14 50H42', // A
  'M28 4C44 4 52 18 52 40S44 76 28 76 4 62 4 40 12 4 28 4Z', // O
  'M50 16C47 8 39 4 29 4 15 4 6 11 6 22S15 37 28 40C42 43 51 48 51 59S41 76 28 76C16 76 8 71 5 63', // S
  'M4 76 28 4 52 76M14 50H42', // A
  'M6 76V4H30C44 4 52 12 52 24S44 44 30 44H8M30 44 52 76', // R
  'M6 76V4L50 76V4', // N
];

const CELL = 56;
const GAP = 14;
const PAD_X = 36;
const TOP = 54;
const WORD = LETTERS.length * CELL + (LETTERS.length - 1) * GAP;
const W = WORD + PAD_X * 2;
const H = 186;

const brush = { type: 'spring', stiffness: 55, damping: 15 } as const;

type Props = {
  /** Paint the lettering in. Without it the board waits with bare letters. */
  play?: boolean;
  className?: string;
  label?: string;
};

/** Hand-painted KAOSARN shop sign that paints itself in, letter by letter. */
export function PaintedSign({ play = true, className, label = 'Kaosarn' }: Props) {
  const reduce = useReducedMotion();
  const painted = reduce || play;

  // Opacity snaps on as each stroke starts, so unpainted letters don't show as round dabs.
  const paint = (delay: number) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: { pathLength: painted ? 1 : 0, opacity: painted ? 1 : 0 },
    transition: { ...brush, delay, opacity: { duration: 0.01, delay } },
  });
  const stroke = (i: number) => paint(0.25 + i * 0.13);

  return (
    <motion.svg
      className={`${styles.sign} ${className ?? ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
      initial={reduce ? false : { rotate: -5, y: -14, opacity: 0 }}
      animate={painted ? { rotate: -1.5, y: 0, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 120, damping: 11 }}
    >
      <rect className={styles.board} x="0" y="0" width={W} height={H} rx="20" />
      <rect className={styles.border} x="10" y="10" width={W - 20} height={H - 20} rx="13" />
      {[
        [24, 24],
        [W - 24, 24],
        [24, H - 24],
        [W - 24, H - 24],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className={styles.screw} cx={cx} cy={cy} r="3.5" />
      ))}

      <motion.text
        className={styles.thai}
        x={W / 2}
        y="42"
        textAnchor="middle"
        lang="th"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: painted ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        ร้านอาหารข้าวสาร
      </motion.text>

      <g
        transform={`translate(${PAD_X + 6} ${TOP}) skewX(-7)`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Offset shade, painted first */}
        <g className={styles.shade} transform="translate(4.5 4.5)">
          {LETTERS.map((d, i) => (
            <motion.path key={i} d={d} transform={`translate(${i * (CELL + GAP)} 0)`} {...stroke(i)} />
          ))}
        </g>
        <g className={styles.letters}>
          {LETTERS.map((d, i) => (
            <motion.path key={i} d={d} transform={`translate(${i * (CELL + GAP)} 0)`} {...stroke(i)} />
          ))}
        </g>
      </g>

      <motion.path
        className={styles.swash}
        d={`M${PAD_X + 10} ${H - 27} C${W * 0.3} ${H - 35} ${W * 0.62} ${H - 19} ${W - PAD_X - 6} ${H - 30}`}
        {...paint(0.25 + LETTERS.length * 0.13)}
      />
    </motion.svg>
  );
}
