import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { business } from '../data/business';
import { NeonSign } from './NeonSign';
import { Photo } from './Photo';
import { StatusPill } from './StatusPill';
import { ArrowDown, ArrowUpRight, Star } from './Icons';
import styles from './Hero.module.css';

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 18, delay },
  }),
};

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) =>
    reduce ? {} : { variants: rise, initial: 'hidden', animate: 'show', custom: delay };

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.bg} aria-hidden="true">
        <Photo slot="hero" alt="" sizes="100vw" priority motif="ambient" className={styles.photo} />
        <div className={styles.shade} />
        <motion.div
          className={styles.spill}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.9 }}
        />
        <div className={styles.steam}>
          {Array.from({ length: 7 }, (_, i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
        <div className={styles.traffic}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      </div>

      <div className={`wrap ${styles.inner}`}>
        <motion.div {...enter(0.1)}>
          <StatusPill />
        </motion.div>

        <motion.p className={styles.where} {...enter(0.2)}>
          Tooting High Street · SW17
        </motion.p>

        <h1 id="hero-title" className={styles.title}>
          <NeonSign className={styles.sign} />
          <span className="visually-hidden"> Tooting</span>
        </h1>

        <motion.p className={styles.tagline} {...enter(1.3)}>
          {business.tagline.map((word, i) => (
            <span key={word}>
              {i > 0 && <i aria-hidden="true">·</i>}
              {word}
            </span>
          ))}
        </motion.p>

        <motion.div className={styles.ctas} {...enter(1.45)}>
          <motion.a
            className="btn btn-primary"
            href={business.reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            Reserve <ArrowUpRight />
            <span className="visually-hidden">(opens TheFork in a new tab)</span>
          </motion.a>
          <motion.a
            className="btn btn-lime"
            href="#menu"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            See the menu
          </motion.a>
        </motion.div>

        <motion.ul className={styles.ratings} {...enter(1.6)} aria-label="Delivery app ratings">
          {business.ratings.map((r) => (
            <li key={r.source}>
              <Star className={styles.star} />
              <strong>{r.score}</strong> {r.source}
              <span>{r.count}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.a
        href="#story"
        className={styles.cue}
        aria-label="Scroll to our story"
        animate={reduce ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowDown />
      </motion.a>
    </section>
  );
}
