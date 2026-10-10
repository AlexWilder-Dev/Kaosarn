import { motion, useReducedMotion } from 'framer-motion';
import { dishById } from '../data/menu';
import { hasPhoto } from '../data/photos';
import { Photo } from './Photo';
import { EnquiryForm } from './EnquiryForm';
import { Lotus } from './Ornament';
import styles from './Groups.module.css';

// An example spread of real menu dishes (the actual set isn't published).
const SPREAD = [
  'pho-pia-tod',
  'satay-gai',
  'tod-mun-pla',
  'som-tum-thai',
  'pad-thai',
  'gang-keaw-waan',
  'moo-ping',
  'peek-gai-tod',
  'massaman',
  'larb',
  'pad-kee-mao',
  'sticky-rice',
];

export function Groups() {
  const reduce = useReducedMotion();

  return (
    <section id="groups" className={`section ${styles.groups}`} aria-labelledby="groups-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">Groups &amp; birthdays</span>
          <h2 id="groups-title" className="section-title">
            Big table <em>energy</em>
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
                alt="A sharing spread from above: satay, spring rolls, papaya salad, larb, curry and more"
                sizes="(min-width: 1000px) 460px, 92vw"
                className={styles.photo}
              />
            </motion.div>
          )}

          <div className={styles.side}>
            <div className={styles.set}>
              <Lotus className={styles.setLotus} />
              <div className={styles.setHead}>
                <h3 className={styles.setTitle}>The sharing set</h3>
                <p className={styles.setPrice}>
                  <span>Price</span>
                  <em>Ask us</em>
                </p>
              </div>
              <p className={styles.setNote}>An example spread from our menu. Ask us what’s in the set.</p>

              <ul className={styles.dishes} aria-label="Example sharing spread">
                {SPREAD.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={reduce ? false : { opacity: 0, y: 14, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.04 }}
                  >
                    {dishById(id).name}
                  </motion.li>
                ))}
              </ul>
            </div>

            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
