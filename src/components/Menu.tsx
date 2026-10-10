import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { MENU, SPICE_LEVELS, TAGS, formatPrice, type Category, type Dish, type Tag } from '../data/menu';
import { Ornament } from './Ornament';
import { Check, Chilli, Rice } from './Icons';
import styles from './Menu.module.css';

const TAG_ORDER: Tag[] = ['V', 'GF', 'H'];
const spring = { type: 'spring', stiffness: 380, damping: 34 } as const;

type SpiceChoice = Record<string, string>;

const matches = (dish: Dish, active: Tag[]) => active.every((t) => dish.tags.includes(t));
const filterable = MENU.filter((c) => !c.compact);
const totalDishes = filterable.reduce((n, c) => n + c.dishes.length, 0);

/** Dishes shown for a category. Sides are add-ons, so dietary filters don't hide them. */
const visible = (c: Category, active: Tag[]) => (c.compact ? c.dishes : c.dishes.filter((d) => matches(d, active)));

export function Menu() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Tag[]>([]);
  const [spice, setSpice] = useState<SpiceChoice>({});
  const [current, setCurrent] = useState(MENU[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);

  const category = MENU.find((c) => c.id === current) ?? MENU[0];
  const shown = filterable.reduce((n, c) => n + visible(c, active).length, 0);

  const toggle = (tag: Tag) =>
    setActive((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : TAG_ORDER.filter((t) => t === tag || prev.includes(t)),
    );

  const choose = (id: string, focus = false) => {
    setCurrent(id);
    if (focus) document.getElementById(`menu-tab-${id}`)?.focus();
  };

  // Jump to Sides from a "no rice" note: switch tab, bring the tabs into view.
  const showSides = () => {
    setCurrent('sides');
    tabsRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = MENU.findIndex((c) => c.id === current);
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % MENU.length
        : e.key === 'ArrowLeft'
          ? (i - 1 + MENU.length) % MENU.length
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? MENU.length - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(MENU[next].id, true);
  };

  return (
    <section id="menu" className={`section ${styles.menu}`} aria-labelledby="menu-title">
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">The main event</span>
          <h2 id="menu-title" className="section-title">
            The <em>menu</em>
          </h2>
          <p className={styles.lede}>
            Street-style Thai, home cooked. Order a few things, put them in the middle and share the lot.
          </p>
          <Ornament tone="ink" className={styles.ornament} />
        </header>

        <div className={styles.filters}>
          <p id="filter-label" className={styles.filterLabel}>
            Dietary
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
                  whileTap={{ scale: 0.95 }}
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
                <strong>{shown}</strong> of {totalDishes} dishes match.{' '}
                <button type="button" className={styles.clear} onClick={() => setActive([])}>
                  Clear
                </button>
              </>
            ) : (
              <>Tags are as listed by the restaurant. If you have an allergy, please tell the team when you order.</>
            )}
          </p>
        </div>

        <div ref={tabsRef} className={styles.tabsBar}>
          <LayoutGroup id="menu-tabs">
            <div className={styles.tabs} role="tablist" aria-label="Menu sections" onKeyDown={onTabKey}>
              {MENU.map((c) => {
                const on = c.id === current;
                return (
                  <button
                    key={c.id}
                    id={`menu-tab-${c.id}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="menu-panel"
                    tabIndex={on ? 0 : -1}
                    className={styles.tab}
                    onClick={() => choose(c.id)}
                  >
                    <span className={styles.tabLabel}>{c.title}</span>
                    <span className={styles.tabThai} lang="th">
                      {c.thai}
                    </span>
                    <span className={styles.tabCount} aria-label={`${visible(c, active).length} dishes`}>
                      {visible(c, active).length}
                    </span>
                    {on && <motion.span layoutId="menu-tab-mark" className={styles.tabMark} transition={spring} />}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`menu-tab-${current}`} className={styles.panel}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
              <CategoryBlock
                category={category}
                active={category.compact ? [] : active}
                spice={spice}
                onSpice={(id, level) => setSpice((s) => ({ ...s, [id]: level }))}
                onClear={() => setActive([])}
                onSides={showSides}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className={styles.footnote}>Sample prices — please check with the restaurant.</p>
      </div>
    </section>
  );
}

type BlockProps = {
  category: Category;
  active: Tag[];
  spice: SpiceChoice;
  onSpice: (id: string, level: string) => void;
  onClear: () => void;
  onSides: () => void;
};

function CategoryBlock({ category, active, spice, onSpice, onClear, onSides }: BlockProps) {
  const dishes = visible(category, active);
  const hasNoRice = category.dishes.some((d) => d.noRice);

  return (
    <div className={styles.category}>
      <header className={styles.catHead}>
        <h3 className={styles.catTitle}>{category.title}</h3>
        <span className={styles.catThai} lang="th">
          {category.thai}
        </span>
      </header>

      {hasNoRice && (
        <p className={styles.riceNote}>
          <Rice className={styles.riceIcon} />
          <span>
            Curries and Pad Kra-Praw come <strong>without rice</strong>.{' '}
            <button type="button" className={styles.inlineLink} onClick={onSides}>
              Add some from the sides
            </button>
            .
          </span>
        </p>
      )}

      {category.compact ? (
        <ul className={styles.sides}>
          {dishes.map((d) => (
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
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={spring}
              >
                <DishCard dish={d} spice={spice[d.id]} onSpice={(level) => onSpice(d.id, level)} onSides={onSides} />
              </motion.li>
            ))}
          </AnimatePresence>
          {dishes.length === 0 && (
            <motion.li className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No {category.title.toLowerCase()} match all of those filters.{' '}
              <button type="button" className={styles.inlineLink} onClick={onClear}>
                Clear filters
              </button>
            </motion.li>
          )}
        </motion.ul>
      )}
    </div>
  );
}

function TagBadge({ tag }: { tag: Tag }) {
  return (
    <abbr className={styles.tag} data-tag={tag} title={TAGS[tag].label}>
      {TAGS[tag].short}
    </abbr>
  );
}

type DishProps = { dish: Dish; spice?: string; onSpice: (level: string) => void; onSides: () => void };

function DishCard({ dish, spice, onSpice, onSides }: DishProps) {
  return (
    <article className={styles.dish}>
      <div className={styles.dishHead}>
        <h4 className={styles.dishName}>{dish.name}</h4>
        <span className={styles.leader} aria-hidden="true" />
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
            <button type="button" className={styles.noRice} onClick={onSides}>
              <Rice /> No rice, add from sides
            </button>
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
              onClick={() => onChange(level.id)}
              whileTap={{ scale: 0.93 }}
              transition={spring}
            >
              {on && (
                <motion.span layoutId={`spice-pill-${dish.id}`} className={styles.spicePill} transition={spring} />
              )}
              <span className={styles.spiceText}>
                {level.label}
                <span className={styles.chillies} aria-hidden="true">
                  {Array.from({ length: level.chillies }, (_, i) => (
                    <Chilli key={i} />
                  ))}
                </span>
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
