import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { business } from '../data/business';
import { StatusPill } from './StatusPill';
import { ArrowUpRight, Close, Menu, Phone } from './Icons';
import styles from './Header.module.css';

export const NAV = [
  { href: '#story', label: 'Story' },
  { href: '#menu', label: 'Menu' },
  { href: '#drinks', label: 'BYOB & bar' },
  { href: '#groups', label: 'Groups' },
  { href: '#visit', label: 'Visit' },
];

const spring = { type: 'spring', stiffness: 380, damping: 32 } as const;

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
          <a href="#top" className={styles.logo} onClick={() => setOpen(false)}>
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
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={spring}
          >
            <nav aria-label="Sections">
              <ul>
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.04 * i + 0.05 }}
                  >
                    <a href={item.href} onClick={() => setOpen(false)}>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className={styles.sheetFoot}>
              <StatusPill />
              <a className="btn btn-quiet" href={business.phone.href}>
                <Phone /> {business.phone.display}
              </a>
              <p>
                {business.address.line1}, {business.address.postcode}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
