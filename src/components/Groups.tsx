import { motion, useReducedMotion } from 'framer-motion';
import { dishById } from '../data/menu';
import { Photo } from './Photo';
import { hasPhoto } from '../data/photos';
import { EnquiryForm } from './EnquiryForm';
import styles from './Groups.module.css';

type Motif = 'roll' | 'skewer' | 'cake' | 'salad' | 'noodles' | 'curry' | 'rice' | 'wings';

// An example spread built from real menu dishes (not the actual set, which isn't published).
const SPREAD: { id: string; motif: Motif; size: 'sm' | 'md' | 'lg' }[] = [
  { id: 'pho-pia-tod', motif: 'roll', size: 'sm' },
  { id: 'satay-gai', motif: 'skewer', size: 'md' },
  { id: 'tod-mun-pla', motif: 'cake', size: 'sm' },
  { id: 'som-tum-thai', motif: 'salad', size: 'md' },
  { id: 'pad-thai', motif: 'noodles', size: 'lg' },
  { id: 'gang-keaw-waan', motif: 'curry', size: 'lg' },
  { id: 'moo-ping', motif: 'skewer', size: 'sm' },
  { id: 'peek-gai-tod', motif: 'wings', size: 'md' },
  { id: 'massaman', motif: 'curry', size: 'md' },
  { id: 'larb', motif: 'salad', size: 'sm' },
  { id: 'pad-kee-mao', motif: 'noodles', size: 'md' },
  { id: 'sticky-rice', motif: 'rice', size: 'sm' },
];

const TILT = [-6, 4, -2, 7, -4, 3, 5, -7, 2, -3, 6, -5];

export function Groups() {
  const reduce = useReducedMotion();

  return (
    <section id="groups" className={`section ${styles.groups}`} aria-labelledby="groups-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">groups &amp; birthdays</span>
          <h2 id="groups-title" className="section-title">
            Big table <span className="neon-pink">energy</span>
          </h2>
          <p className="lede">
            Birthdays, catch-ups, the whole group chat. Kaosarn is a favourite for big tables, and our tasting set menu
            is built around sharing street-style dishes, so everyone gets a bit of everything.
          </p>
          <ul className={styles.perks}>
            <li>Tasting set menu for groups</li>
            <li>BYOB or the full bar</li>
            <li>Birthdays welcome</li>
          </ul>
        </header>

        <div className={styles.layout}>
          <div className={styles.table}>
            <div className={styles.setCard}>
              <div>
                <h3 className={styles.setTitle}>The sharing set</h3>
                <p className={styles.setNote}>An example spread from our menu. Ask us what’s in the set.</p>
              </div>
              <p className={styles.setPrice}>
                <span>Price</span>
                Ask us
              </p>
            </div>

            <ul className={styles.plates} aria-label="Example sharing spread">
              {SPREAD.map((p, i) => {
                const dish = dishById(p.id);
                return (
                  <motion.li
                    key={p.id}
                    className={styles.plateCell}
                    data-size={p.size}
                    initial={reduce ? false : { opacity: 0, scale: 0.4, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 16,
                      delay: (i % 6) * 0.06 + Math.floor(i / 6) * 0.15,
                    }}
                  >
                    <motion.div
                      className={styles.plate}
                      data-motif={p.motif}
                      style={{ rotate: TILT[i] }}
                      whileHover={{ scale: 1.08, rotate: TILT[i] + 12 }}
                      whileTap={{ scale: 0.94 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                    >
                      <PlateArt motif={p.motif} />
                    </motion.div>
                    <span className={styles.plateName}>{dish.name}</span>
                  </motion.li>
                );
              })}
            </ul>

            {hasPhoto('groups') && (
              <div className={styles.tablePhoto}>
                <Photo
                  slot="groups"
                  alt="At Kaosarn Tooting"
                  sizes="(min-width: 1000px) 560px, 92vw"
                  className={styles.photo}
                />
              </div>
            )}
          </div>

          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}

function PlateArt({ motif }: { motif: Motif }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        {motif === 'roll' && (
          <>
            <rect x="8" y="14" width="32" height="9" rx="4.5" transform="rotate(-20 24 18)" />
            <rect x="8" y="26" width="32" height="9" rx="4.5" transform="rotate(-20 24 30)" />
          </>
        )}
        {motif === 'skewer' && (
          <>
            <path d="M8 40 40 8" />
            <rect x="13" y="25" width="10" height="8" rx="3" transform="rotate(-45 18 29)" />
            <rect x="20" y="18" width="10" height="8" rx="3" transform="rotate(-45 25 22)" />
            <rect x="27" y="11" width="10" height="8" rx="3" transform="rotate(-45 32 15)" />
          </>
        )}
        {motif === 'cake' && (
          <>
            <ellipse cx="18" cy="22" rx="9" ry="7" />
            <ellipse cx="30" cy="28" rx="9" ry="7" />
            <path d="M14 21h.01M22 23h.01M27 27h.01M33 29h.01" />
          </>
        )}
        {motif === 'salad' && (
          <>
            <path d="M18 10c9 5 9 17 0 26-9-9-9-21 0-26ZM18 14v18" />
            <path d="M30 14c7 6 7 16-1 22-6-7-6-16 1-22Z" />
            <circle cx="33" cy="34" r="3" />
          </>
        )}
        {motif === 'noodles' && (
          <>
            <path d="M10 18c4-3 6 3 10 0s6 3 10 0 6 3 8 1" />
            <path d="M10 24c4-3 6 3 10 0s6 3 10 0 6 3 8 1" />
            <path d="M10 30c4-3 6 3 10 0s6 3 10 0 6 3 8 1" />
            <path d="M30 6 42 40M36 6l6 32" />
          </>
        )}
        {motif === 'curry' && (
          <>
            <circle cx="24" cy="24" r="15" />
            <path d="M14 26c4-4 8 2 12-2s8 0 9 2" />
            <path d="M22 16c3-2 6-1 7 2-3 2-6 1-7-2Z" />
          </>
        )}
        {motif === 'rice' && (
          <>
            <path d="M10 32c1-10 9-16 14-16s13 6 14 16Z" />
            <path d="M18 26h.01M24 22h.01M29 27h.01M22 29h.01" />
          </>
        )}
        {motif === 'wings' && (
          <>
            <path d="M14 30c-4-8 2-18 10-16 6 1 7 8 3 12l-6 8c-3 2-6 0-7-4Z" />
            <path d="M28 26 36 34M34 36l4-1 1-4" />
          </>
        )}
      </g>
    </svg>
  );
}
