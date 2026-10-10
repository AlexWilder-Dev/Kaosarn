import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { business } from '../data/business';
import { Photo } from './Photo';
import { StatusPill } from './StatusPill';
import { ArrowUpRight, Pin, Star } from './Icons';
import styles from './Hero.module.css';

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 110, damping: 18, delay },
  }),
};

const tap = { type: 'spring', stiffness: 420, damping: 22 } as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '12%']);
  const enter = (delay: number) =>
    reduce ? {} : { variants: rise, initial: 'hidden', animate: 'show', custom: delay };

  return (
    <section ref={ref} id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.frame}>
        <motion.div
          className={styles.media}
          style={{ y: drift }}
          initial={reduce ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 40, damping: 18 }}
        >
          <Photo
            slot="hero"
            alt="The dining room at Kaosarn Tooting, hung with garlands under its red Thai name sign"
            sizes="(min-width: 1260px) 1200px, 100vw"
            priority
            focus="58% 50%"
            className={styles.photo}
          />
        </motion.div>
        <div className={styles.shade} aria-hidden="true" />

        <h1 id="hero-title" className={styles.title}>
          <span className="visually-hidden">Kaosarn Tooting: </span>
          {business.tagline.map((line, i) => (
            <motion.span key={line} className={styles.line} {...enter(0.35 + i * 0.12)}>
              {line}
            </motion.span>
          ))}
        </h1>
      </div>

      <div className={`wrap ${styles.below}`}>
        <motion.div className={styles.meta} {...enter(0.8)}>
          <StatusPill />
          <span className={styles.where}>
            <Pin /> {business.address.line1}, {business.address.postcode}
          </span>
        </motion.div>

        <motion.div className={styles.ctas} {...enter(0.9)}>
          <motion.a
            className="btn btn-primary"
            href={business.reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={tap}
          >
            Reservation <ArrowUpRight />
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

        <motion.ul className={styles.ratings} {...enter(1)} aria-label="Delivery app ratings">
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
