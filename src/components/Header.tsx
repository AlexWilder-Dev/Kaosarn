import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { business } from '../data/business';
import { StatusPill } from './StatusPill';
import { ArrowUpRight, Close, Menu, Phone } from './Icons';
import styles from './Header.module.css';

export const NAV = [
  { href: '#story', label: 'Our story', thai: 'เรื่องราวของเรา' },
  { href: '#menu', label: 'Menu', thai: 'เมนู' },
  { href: '#drinks', label: 'BYOB & bar', thai: 'เครื่องดื่ม' },
  { href: '#groups', label: 'Groups', thai: 'งานเลี้ยง' },
  { href: '#visit', label: 'Visit', thai: 'ติดต่อเรา' },
];

const spring = { type: 'spring', stiffness: 260, damping: 30 } as const;

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 24));

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className={styles.header} data-solid={solid || open}>
        <div className={`wrap ${styles.bar}`}>
          <a
            href="#top"
            className={styles.logo}
            onClick={() => setOpen(false)}
            aria-label="Kaosarn Tooting, back to top"
          >
            <span className={styles.word}>Kaosarn</span>
            <span className={styles.place}>Tooting</span>
          </a>

          <nav className={styles.nav} aria-label="Sections">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <motion.a
              className="btn btn-primary btn-sm"
              href={business.reserveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
            >
              Reserve <ArrowUpRight />
              <span className="visually-hidden">(opens TheFork in a new tab)</span>
            </motion.a>
            <button
              ref={toggleRef}
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <Close /> : <Menu />}
              <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its backdrop-filter would otherwise trap this fixed sheet. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={sheetRef}
            className={styles.sheet}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          >
            <nav aria-label="Sections">
              <ol>
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.08 + 0.05 * i }}
                  >
                    <a href={item.href} onClick={() => setOpen(false)}>
                      <span className={styles.num} aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={styles.label}>{item.label}</span>
                      <span className={styles.thai} lang="th" aria-hidden="true">
                        {item.thai}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ol>
            </nav>
            <motion.div
              className={styles.sheetFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <StatusPill />
              <a className="btn btn-secondary" href={business.phone.href}>
                <Phone /> {business.phone.display}
              </a>
              <p>
                {business.address.line1}, {business.address.postcode}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
