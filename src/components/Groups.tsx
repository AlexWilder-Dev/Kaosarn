import { motion, useReducedMotion } from 'framer-motion';
import { dishById } from '../data/menu';
import { hasPhoto } from '../data/photos';
import { Photo } from './Photo';
import { EnquiryForm } from './EnquiryForm';
import styles from './Groups.module.css';

// An example spread of real menu dishes (the actual set isn't published), each
// lettered on an enamel plate. `label` shortens names that won't fit on a plate.
const SPREAD: { id: string; label?: string; size: 'sm' | 'md' | 'lg' }[] = [
  { id: 'pho-pia-tod', size: 'sm' },
  { id: 'satay-gai', size: 'md' },
  { id: 'tod-mun-pla', size: 'sm' },
  { id: 'som-tum-thai', label: 'Som Tum', size: 'md' },
  { id: 'pad-thai', size: 'lg' },
  { id: 'gang-keaw-waan', label: 'Green Curry', size: 'lg' },
  { id: 'moo-ping', size: 'sm' },
  { id: 'peek-gai-tod', size: 'md' },
  { id: 'massaman', size: 'md' },
  { id: 'larb', size: 'sm' },
  { id: 'pad-kee-mao', label: 'Pad Kee Mao', size: 'md' },
  { id: 'sticky-rice', size: 'sm' },
];

const RIMS = ['var(--enamel-blue)', 'var(--chilli)', 'var(--leaf)', 'var(--turmeric-dark)'];
const TILT = [-6, 4, -2, 7, -4, 3, 5, -7, 2, -3, 6, -5];

export function Groups() {
  const reduce = useReducedMotion();

  return (
    <section id="groups" className={`section ${styles.groups}`} aria-labelledby="groups-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">groups &amp; birthdays</span>
          <h2 id="groups-title" className="section-title">
            Big table <span className="accent">energy</span>
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

        {hasPhoto('groups') && (
          <motion.div
            className={styles.photoWrap}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <Photo
              slot="groups"
              alt="The main dining room with tables laid, and the open kitchen pass at the back"
              sizes="(min-width: 1260px) 1200px, 94vw"
              className={styles.photo}
            />
          </motion.div>
        )}

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
                    initial={reduce ? false : { opacity: 0, scale: 0.5, y: 24 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 17,
                      delay: (i % 6) * 0.05 + Math.floor(i / 6) * 0.12,
                    }}
                  >
                    <motion.div
                      className={styles.plate}
                      style={{ rotate: TILT[i], ['--rim' as string]: RIMS[i % RIMS.length] }}
                      whileHover={reduce ? undefined : { scale: 1.06, rotate: TILT[i] + 8 }}
                      whileTap={reduce ? undefined : { scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                    >
                      <span className={styles.plateName}>{p.label ?? dish.name}</span>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
