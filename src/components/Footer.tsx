import { business, mailto } from '../data/business';
import { NAV } from './Header';
import { ArrowUpRight } from './Icons';
import { Ornament } from './Ornament';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <img
            className={styles.mark}
            src={`${import.meta.env.BASE_URL}icon-192.png`}
            width="96"
            height="96"
            alt="Kaosarn Tooting logo"
            loading="lazy"
          />
          <div>
            <p className={styles.wordmark}>
              Kaosarn <em>Tooting</em>
            </p>
            <p className={styles.thai} lang="th">
              ข้าวสาร
            </p>
          </div>
        </div>
        <p className={styles.tagline}>{business.tagline.join(' · ')}</p>
        <Ornament />

        <div className={styles.cols}>
          <div>
            <h2 className={styles.label}>Find us</h2>
            <address className={styles.text}>
              {business.address.line1}
              <br />
              {business.address.city} {business.address.postcode}
              <br />
              {business.nearby}
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

        <div className={styles.bottom}>
          <a className="btn btn-primary" href={business.reserveUrl} target="_blank" rel="noopener noreferrer">
            Reservation <ArrowUpRight />
            <span className="visually-hidden">(opens TheFork in a new tab)</span>
          </a>
          <p className={styles.legal}>
            © {new Date().getFullYear()} {business.name} · <span lang="th">ขอบคุณ</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
