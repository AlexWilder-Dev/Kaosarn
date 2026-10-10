import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { business, mailto } from '../data/business';
import { PaintedSign } from './PaintedSign';
import { NAV } from './Header';
import { ArrowUpRight } from './Icons';
import styles from './Footer.module.css';

export function Footer() {
  const signRef = useRef<HTMLDivElement>(null);
  const seen = useInView(signRef, { once: true, margin: '0px 0px -15% 0px' });

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div ref={signRef} className={styles.signBox}>
          <PaintedSign play={seen} className={styles.sign} label="Kaosarn Tooting" />
          <p className={styles.tagline}>
            {business.tagline.map((word, i) => (
              <span key={word}>
                {i > 0 && <i aria-hidden="true">·</i>}
                {word}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.cols}>
          <div>
            <h2 className={styles.label}>Find us</h2>
            <address className={styles.text}>
              {business.address.line1}
              <br />
              {business.address.city} {business.address.postcode}
            </address>
          </div>
          <div>
            <h2 className={styles.label}>Get in touch</h2>
            <p className={styles.text}>
              <a href={business.phone.href}>{business.phone.display}</a>
              <br />
              <a href={mailto()} className={styles.mail}>
                {business.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className={styles.label}>Explore</h2>
            <ul className={styles.links}>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a className={`btn ${styles.reserve}`} href={business.reserveUrl} target="_blank" rel="noopener noreferrer">
          Reserve a table <ArrowUpRight />
          <span className="visually-hidden">(opens TheFork in a new tab)</span>
        </a>

        <p className={styles.legal}>
          © {new Date().getFullYear()} {business.name} · <span lang="th">ขอบคุณ</span> · see you soon
        </p>
      </div>
    </footer>
  );
}
