import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'framer-motion';
import { business } from '../data/business';
import { Photo } from './Photo';
import { StatusPill } from './StatusPill';
import { Lotus } from './Ornament';
import { ArrowDown, ArrowUpRight, Star } from './Icons';
import styles from './Hero.module.css';

const LINES: { text: string; italic?: boolean }[] = [
  { text: 'Thai food,' },
  { text: 'home cooked.', italic: true },
  { text: 'Good vibes.' },
];

const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18, delay } }),
};

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const roundelY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90]);
  const archY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 40]);
  const enter = (delay: number) =>
    reduce ? {} : { variants: fade, initial: 'hidden', animate: 'show', custom: delay };

  return (
    <section ref={ref} id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.head}>
          <motion.p className="kicker" {...enter(0.1)}>
            Thai kitchen &amp; bar · Tooting
          </motion.p>

          <h1 id="hero-title" className={styles.title}>
            <span className="visually-hidden">Kaosarn Tooting: </span>
            {LINES.map((line, i) => (
              <span key={line.text} className={styles.lineMask}>
                <motion.span
                  className={styles.line}
                  data-italic={line.italic}
                  initial={reduce ? false : { y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.25 + i * 0.12 }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        <div className={styles.body}>
          <motion.p className={styles.lede} {...enter(0.75)}>
            From Bangkok’s Khaosan Road to Tooting High Street: street-style Thai cooking made for sharing, with a fully
            licensed bar, or bring your own bottle.
          </motion.p>

          <motion.div className={styles.ctas} {...enter(0.9)}>
            <motion.a
              className="btn btn-primary"
              href={business.reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Reserve a table <ArrowUpRight />
              <span className="visually-hidden">(opens TheFork in a new tab)</span>
            </motion.a>
            <a className="link-arrow" href="#menu">
              Explore the menu <ArrowDown />
            </a>
          </motion.div>

          <motion.div className={styles.meta} {...enter(1.05)}>
            <StatusPill />
            <ul className={styles.ratings} aria-label="Delivery app ratings">
              {business.ratings.map((r) => (
                <li key={r.source}>
                  <Star className={styles.star} />
                  <strong>{r.score}</strong> {r.source}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className={styles.art}>
          <motion.div className={styles.archWrap} style={{ y: archY }}>
            <Lotus className={styles.apex} />
            <motion.div
              className={styles.arch}
              initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ type: 'spring', stiffness: 38, damping: 15, delay: 0.2 }}
            >
              <Photo
                slot="hero"
                alt="Yum nam tok, som tum and larb on enamel plates"
                sizes="(min-width: 960px) 520px, 86vw"
                priority
                focus="50% 40%"
                className={styles.photo}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.roundel}
            style={{ y: roundelY }}
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.9 }}
          >
            <Photo
              slot="room"
              alt="The dining room, hung with garlands under the restaurant's red Thai name sign"
              sizes="(min-width: 960px) 220px, 38vw"
              focus="62% 45%"
              className={styles.roundelPhoto}
            />
          </motion.div>

          <motion.figure className={styles.signature} {...enter(1.2)}>
            <span className={styles.thaiArt} lang="th">
              ข้าวสาร
            </span>
            <figcaption>
              <em>khao san</em>: milled rice, and the Bangkok road we’re named after
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
