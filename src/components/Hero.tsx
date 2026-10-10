import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { business } from '../data/business';
import { PaintedSign } from './PaintedSign';
import { Photo } from './Photo';
import { StatusPill } from './StatusPill';
import { ArrowUpRight, Pin, Star } from './Icons';
import styles from './Hero.module.css';

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18, delay },
  }),
};

const tap = { type: 'spring', stiffness: 420, damping: 20 } as const;

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce ? {} : { variants: rise, initial: 'hidden', animate: 'show', custom: delay };

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <motion.div
        className={styles.media}
        initial={reduce ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 40, damping: 16 }}
      >
        <Photo
          slot="hero"
          alt="Larb, som tum and grilled beef salad on enamel plates"
          sizes="(min-width: 960px) 46vw, 100vw"
          priority
          focus="50% 38%"
          className={styles.photo}
        />
      </motion.div>

      <div className={styles.copy}>
        <h1 id="hero-title" className={styles.title}>
          <PaintedSign className={styles.sign} />
          <span className="visually-hidden"> Tooting</span>
        </h1>

        <motion.p className={styles.tagline} {...enter(1.2)}>
          {business.tagline.map((word, i) => (
            <span key={word}>
              {i > 0 && <i aria-hidden="true">·</i>}
              {word}
            </span>
          ))}
        </motion.p>

        <motion.div className={styles.meta} {...enter(1.3)}>
          <StatusPill />
          <span className={styles.where}>
            <Pin /> {business.address.line1}, SW17
          </span>
        </motion.div>

        <motion.div className={styles.ctas} {...enter(1.4)}>
          <motion.a
            className="btn btn-primary"
            href={business.reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={tap}
          >
            Reserve <ArrowUpRight />
            <span className="visually-hidden">(opens TheFork in a new tab)</span>
          </motion.a>
          <motion.a
            className="btn btn-secondary"
            href="#menu"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={tap}
          >
            See the menu
          </motion.a>
        </motion.div>

        <motion.ul className={styles.ratings} {...enter(1.5)} aria-label="Delivery app ratings">
          {business.ratings.map((r) => (
            <li key={r.source}>
              <Star className={styles.star} />
              <strong>{r.score}</strong> {r.source}
              <span>{r.count}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
