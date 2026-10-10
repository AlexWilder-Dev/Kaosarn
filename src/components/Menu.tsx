import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, LayoutGroup, animate, motion, useReducedMotion } from 'framer-motion';
import { MENU, SPICE_LEVELS, TAGS, formatPrice, type Category, type Dish, type Tag } from '../data/menu';
import { Photo } from './Photo';
import { hasPhoto } from '../data/photos';
import { Check, Chilli, Rice } from './Icons';
import styles from './Menu.module.css';

const TAG_ORDER: Tag[] = ['V', 'GF', 'H'];
const spring = { type: 'spring', stiffness: 420, damping: 34 } as const;

type SpiceChoice = Record<string, string>;

const matches = (dish: Dish, active: Tag[]) => active.every((t) => dish.tags.includes(t));
const filterable = MENU.filter((c) => !c.compact);
const totalDishes = filterable.reduce((n, c) => n + c.dishes.length, 0);

export function Menu() {
  const [active, setActive] = useState<Tag[]>([]);
  const [spice, setSpice] = useState<SpiceChoice>({});
  const [current, setCurrent] = useState(MENU[0].id);

  const toggle = (tag: Tag) =>
    setActive((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : TAG_ORDER.filter((t) => t === tag || prev.includes(t)),
    );

  const shown = filterable.reduce((n, c) => n + c.dishes.filter((d) => matches(d, active)).length, 0);

  useScrollSpy(setCurrent);

  return (
    <section id="menu" className={`section ${styles.menu}`} aria-labelledby="menu-title">
      <div className={`wrap ${styles.intro}`} data-photo={hasPhoto('menu')}>
        <div className={styles.introHead}>
          <span className="kicker">the main event</span>
          <h2 id="menu-title" className="section-title">
            The <span className="accent">Menu</span>
          </h2>
        </div>

        {hasPhoto('menu') && (
          <div className={styles.introPhoto}>
            <Photo
              slot="menu"
              alt="Larb, som tum and grilled beef salad on enamel plates"
              sizes="(min-width: 900px) 380px, 92vw"
              className={styles.photo}
            />
            <span className={styles.photoTag}>fresh from the wok</span>
          </div>
        )}

        <div className={styles.introBody}>
          <p className="lede">
            Street-style Thai, home cooked. Order a few things, put them in the middle and share the lot.
          </p>

          <div className={styles.filters}>
            <p id="filter-label" className={styles.filterLabel}>
              Filter dishes
            </p>
            <div className={styles.chips} role="group" aria-labelledby="filter-label">
              {TAG_ORDER.map((tag) => {
                const on = active.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    type="button"
                    className={styles.chip}
                    data-tag={tag}
                    aria-pressed={on}
                    onClick={() => toggle(tag)}
                    whileTap={{ scale: 0.94 }}
                    transition={spring}
                  >
                    <span className={styles.chipMark} aria-hidden="true">
                      {on ? <Check /> : tag}
                    </span>
                    {TAGS[tag].label}
                  </motion.button>
                );
              })}
            </div>
            <p className={styles.count} aria-live="polite">
              {active.length ? (
                <>
                  Showing <strong>{shown}</strong> of {totalDishes} dishes{' '}
                  <button type="button" className={styles.clear} onClick={() => setActive([])}>
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  {totalDishes} dishes, plus sides. Tags are as listed by the restaurant; if you have an allergy, please
                  tell the team when you order.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <MenuNav current={current} active={active} onClear={() => setActive([])} />

      <div className="wrap">
        {MENU.map((cat) => (
          <CategoryBlock
            key={cat.id}
            category={cat}
            active={cat.compact ? [] : active}
            spice={spice}
            onSpice={(id, level) => setSpice((s) => ({ ...s, [id]: level }))}
            onClear={() => setActive([])}
          />
        ))}

        <p className={styles.footnote}>Sample prices — please check with the restaurant.</p>
      </div>
    </section>
  );
}

/** Tracks which category is under the sticky nav. */
function useScrollSpy(onChange: (id: string) => void) {
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) + 90;
      let id = MENU[0].id;
      for (const c of MENU) {
        const el = document.getElementById(`menu-${c.id}`);
        if (el && el.getBoundingClientRect().top <= offset) id = c.id;
      }
      onChange(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [onChange]);
}

function MenuNav({ current, active, onClear }: { current: string; active: Tag[]; onClear: () => void }) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the active tab in view inside the horizontally scrolling bar. Animated by hand:
  // a native smooth scrollTo here would cancel the page's own smooth scroll in Chrome.
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>(`[data-id="${current}"]`);
    if (!list || !tab) return;
    const max = list.scrollWidth - list.clientWidth;
    const target = Math.min(max, Math.max(0, tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2));
    if (reduce) {
      list.scrollLeft = target;
      return;
    }
    const controls = animate(list.scrollLeft, target, {
      type: 'spring',
      stiffness: 260,
      damping: 34,
      onUpdate: (v) => (list.scrollLeft = v),
    });
    return () => controls.stop();
  }, [current, reduce]);

  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(`menu-${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#menu-${id}`);
  };

  return (
    <nav className={styles.nav} aria-label="Menu sections">
      <div className={`wrap ${styles.navInner}`}>
        <LayoutGroup id="menu-nav">
          <ul ref={listRef} className={styles.tabs}>
            {MENU.map((c) => {
              const on = c.id === current;
              return (
                <li key={c.id} data-id={c.id}>
                  <a
                    href={`#menu-${c.id}`}
                    className={styles.tab}
                    aria-current={on ? 'true' : undefined}
                    onClick={(e) => jump(e, c.id)}
                  >
                    {on && <motion.span layoutId="menu-tab" className={styles.tabPill} transition={spring} />}
                    <span className={styles.tabLabel}>{c.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </LayoutGroup>
        <AnimatePresence initial={false}>
          {active.length > 0 && (
            <motion.button
              type="button"
              className={styles.navClear}
              onClick={onClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring}
            >
              {active.join(' + ')} <span aria-hidden="true">×</span>
              <span className="visually-hidden">Clear filters</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

type BlockProps = {
  category: Category;
  active: Tag[];
  spice: SpiceChoice;
  onSpice: (id: string, level: string) => void;
  onClear: () => void;
};

function CategoryBlock({ category, active, spice, onSpice, onClear }: BlockProps) {
  const dishes = category.dishes.filter((d) => matches(d, active));
  const hasNoRice = category.dishes.some((d) => d.noRice);

  return (
    <section
      id={`menu-${category.id}`}
      className={styles.category}
      data-cat={category.id}
      aria-labelledby={`menu-${category.id}-title`}
    >
      <header className={styles.catHead}>
        <h3 id={`menu-${category.id}-title`} className={styles.catTitle}>
          {category.title}
        </h3>
        <span className={styles.catThai} lang="th" aria-hidden="true">
          {category.thai}
        </span>
      </header>

      {hasNoRice && (
        <p className={styles.riceNote}>
          <Rice className={styles.riceIcon} />
          <span>
            Curries and Pad Kra-Praw come <strong>without rice</strong>.{' '}
            <a href="#menu-sides">Add some from the sides</a>.
          </span>
        </p>
      )}

      {category.compact ? (
        <ul className={styles.sides}>
          {category.dishes.map((d) => (
            <li key={d.id} className={styles.side}>
              <span className={styles.sideName}>
                {d.name}
                {d.gloss && <span className={styles.sideGloss}> ({d.gloss.toLowerCase()})</span>}
                {d.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </span>
              <span className={styles.leader} aria-hidden="true" />
              <span className={styles.price}>{formatPrice(d.price)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <motion.ul className={styles.grid} layout="position">
          <AnimatePresence mode="popLayout" initial={false}>
            {dishes.map((d) => (
              <motion.li
                key={d.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={spring}
              >
                <DishCard dish={d} spice={spice[d.id]} onSpice={(level) => onSpice(d.id, level)} />
              </motion.li>
            ))}
          </AnimatePresence>
          {dishes.length === 0 && (
            <motion.li className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No {category.title.toLowerCase()} match all of those filters.{' '}
              <button type="button" className={styles.clear} onClick={onClear}>
                Clear filters
              </button>
            </motion.li>
          )}
        </motion.ul>
      )}
    </section>
  );
}

function TagBadge({ tag }: { tag: Tag }) {
  return (
    <abbr className={styles.tag} data-tag={tag} title={TAGS[tag].label}>
      {TAGS[tag].short}
    </abbr>
  );
}

function DishCard({ dish, spice, onSpice }: { dish: Dish; spice?: string; onSpice: (level: string) => void }) {
  return (
    <article className={styles.dish}>
      <div className={styles.dishHead}>
        <h4 className={styles.dishName}>{dish.name}</h4>
        <span className={styles.price}>{formatPrice(dish.price)}</span>
      </div>
      {(dish.thai || dish.gloss) && (
        <p className={styles.sub}>
          {dish.thai && (
            <span lang="th" className={styles.thaiName}>
              {dish.thai}
            </span>
          )}
          {dish.gloss && <span className={styles.gloss}>{dish.gloss}</span>}
        </p>
      )}
      {dish.desc && <p className={styles.desc}>{dish.desc}</p>}

      {(dish.tags.length > 0 || dish.noRice) && (
        <div className={styles.meta}>
          {dish.tags.map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
          {dish.noRice && (
            <a href="#menu-sides" className={styles.noRice}>
              <Rice /> no rice, add from sides
            </a>
          )}
        </div>
      )}

      {dish.spiceToTaste && <SpicePicker dish={dish} value={spice} onChange={onSpice} />}
    </article>
  );
}

function SpicePicker({ dish, value, onChange }: { dish: Dish; value?: string; onChange: (level: string) => void }) {
  const chosen = SPICE_LEVELS.find((l) => l.id === value);
  const labelId = `spice-${dish.id}`;

  return (
    <div className={styles.spice}>
      <p id={labelId} className={styles.spiceLabel}>
        Spice to taste
      </p>
      <div className={styles.spiceChips} role="radiogroup" aria-labelledby={labelId}>
        {SPICE_LEVELS.map((level) => {
          const on = level.id === value;
          return (
            <motion.button
              key={level.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={styles.spiceChip}
              data-level={level.chillies}
              onClick={() => onChange(level.id)}
              whileTap={{ scale: 0.92 }}
              transition={spring}
            >
              {on && (
                <motion.span layoutId={`spice-pill-${dish.id}`} className={styles.spicePill} transition={spring} />
              )}
              <span className={styles.spiceText}>
                {level.label}
                {level.chillies > 0 && (
                  <span className={styles.chillies} aria-hidden="true">
                    {Array.from({ length: level.chillies }, (_, i) => (
                      <Chilli key={i} />
                    ))}
                  </span>
                )}
              </span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence initial={false}>
        {chosen && (
          <motion.p
            key="hint"
            className={styles.spiceHint}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={spring}
          >
            Ask for it <strong>{chosen.label.toLowerCase()}</strong> when you order.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
