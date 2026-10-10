import { motion, useReducedMotion } from 'framer-motion';
import { business, mailto } from '../data/business';
import { HOURS, formatSessions } from '../lib/hours';
import { useLondonTime } from '../lib/useLondonTime';
import { Photo } from './Photo';
import { hasPhoto } from '../data/photos';
import { StatusPill } from './StatusPill';
import { ArrowUpRight, Mail, Phone, Pin, Train } from './Icons';
import styles from './Visit.module.css';

export function Visit() {
  const reduce = useReducedMotion();
  const now = useLondonTime();

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '0px 0px -12% 0px' },
          transition: { type: 'spring' as const, stiffness: 110, damping: 18, delay },
        };

  return (
    <section id="visit" className={`section ${styles.visit}`} aria-labelledby="visit-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">come say hi</span>
          <h2 id="visit-title" className="section-title">
            Find <span className="accent">us</span>
          </h2>
        </header>

        <div className={styles.grid}>
          <motion.div className={styles.where} {...reveal()}>
            <address className={styles.address}>
              <span className={styles.name}>{business.name}</span>
              {business.address.line1}
              <br />
              {business.address.city} {business.address.postcode}
            </address>
            <p className={styles.tube}>
              <Train /> A short walk from {business.nearby}
            </p>

            <div className={styles.actions}>
              <a className="btn btn-primary" href={business.directionsUrl} target="_blank" rel="noopener noreferrer">
                <Pin /> Get directions
                <span className="visually-hidden">(opens Google Maps in a new tab)</span>
              </a>
              <a className="btn btn-secondary" href={business.phone.href}>
                <Phone /> {business.phone.display}
              </a>
              <a className={`btn btn-quiet ${styles.email}`} href={mailto()}>
                <Mail /> <span className={styles.emailText}>{business.email}</span>
              </a>
            </div>
          </motion.div>

          <motion.div className={styles.hours} {...reveal(0.1)}>
            <div className={styles.hoursHead}>
              <h3>Opening hours</h3>
              <StatusPill />
            </div>
            <table className={styles.table}>
              <caption className="visually-hidden">Opening hours, lunch and dinner</caption>
              <tbody>
                {HOURS.map((d) => {
                  const today = d.day === now.day;
                  return (
                    <tr key={d.day} data-today={today} data-closed={d.sessions.length === 0}>
                      <th scope="row">
                        <span className={styles.dayLong}>{d.long}</span>
                        <span className={styles.dayShort} aria-hidden="true">
                          {d.short}
                        </span>
                        {today && <span className={styles.todayTag}>Today</span>}
                      </th>
                      <td>
                        {d.sessions.length ? (
                          d.sessions.map((s) => (
                            <span key={s.open} className={styles.session}>
                              {s.open}–{s.close}
                            </span>
                          ))
                        ) : (
                          <span className={styles.closed}>{formatSessions(d.sessions)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={styles.hoursNote}>Lunch and dinner, with a break in the afternoon.</p>
            <a
              className={`btn btn-primary ${styles.reserve}`}
              href={business.reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reserve a table <ArrowUpRight />
              <span className="visually-hidden">(opens TheFork in a new tab)</span>
            </a>
          </motion.div>

          {hasPhoto('visit') && (
            <motion.div className={styles.photoWrap} {...reveal(0.15)}>
              <Photo
                slot="visit"
                alt="A corner of the dining room: plank walls, garlands and a green tufted banquette"
                sizes="(min-width: 900px) 560px, 92vw"
                className={styles.photo}
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
