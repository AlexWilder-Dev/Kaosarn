import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Photo } from './Photo';
import { hasPhoto } from '../data/photos';
import styles from './Story.module.css';

type StreetSign =
  | { kind: 'bkk'; thai: string; roman: string; coord: string }
  | { kind: 'ldn'; name: string; district: string; coord: string };

type Beat = {
  sign?: StreetSign;
  title: string;
  body: string;
  photo?: boolean;
};

const BEATS: Beat[] = [
  {
    sign: { kind: 'bkk', thai: 'ถนนข้าวสาร', roman: 'Thanon Khao San', coord: 'Bangkok · 13.76°N 100.50°E' },
    title: 'It starts on Khaosan Road',
    body: "Bangkok's famous backpacker strip: the first stop for travellers landing in Thailand, and where so many people taste Thai food for the very first time.",
  },
  {
    title: 'Woks roaring, tables full',
    body: "Street stalls, late nights, strangers sharing tables. Relaxed, casual, social. That's the Khaosan energy, and it's what we're named after.",
  },
  {
    title: '9,500 km later…',
    body: 'We brought that energy west. (It’s a long way by tuk-tuk.)',
  },
  {
    sign: { kind: 'ldn', name: 'Tooting High Street', district: 'SW17', coord: 'London · 51.43°N 0.17°W' },
    title: 'Now it lives in Tooting',
    body: 'Thai food, home cooked, good vibes. A neighbourhood place with a real community feel. Come hungry, bring your people, stay a while.',
    photo: true,
  },
];

type Geometry = { width: number; height: number; d: string; stops: number[] };

/** Winding road through each beat's marker, swinging side to side between them. */
function buildRoute(track: HTMLElement, markers: HTMLElement[]): Geometry {
  const box = track.getBoundingClientRect();
  const pts = markers.map((m) => {
    const r = m.getBoundingClientRect();
    return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
  });
  const wide = box.width >= 860;
  const swing = wide ? 80 : 12;
  const all = [{ x: pts[0].x, y: 0 }, ...pts, { x: pts[pts.length - 1].x, y: box.height }];

  let d = `M${all[0].x} ${all[0].y}`;
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1];
    const b = all[i];
    const dy = b.y - a.y;
    const s = (i % 2 ? 1 : -1) * swing;
    d += ` C${a.x + s} ${a.y + dy * 0.5} ${b.x + s} ${b.y - dy * 0.5} ${b.x} ${b.y}`;
  }
  return { width: box.width, height: box.height, d, stops: pts.map((p) => p.y / box.height) };
}

export function Story() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const markerRefs = useRef<HTMLElement[]>([]);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [reached, setReached] = useState(reduce ? BEATS.length : 0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 70%', 'end 70%'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
  const drawn = useTransform(smooth, (p) => (reduce ? 1 : Math.min(1, Math.max(0, p))));

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(180);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setGeo(buildRoute(track, markerRefs.current));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const place = useCallback(
    (p: number) => {
      const path = routeRef.current;
      if (!path || !geo) return;
      const len = path.getTotalLength();
      const at = Math.min(len, Math.max(0, p * len));
      const here = path.getPointAtLength(at);
      const ahead = path.getPointAtLength(Math.min(len, at + 2));
      const behind = path.getPointAtLength(Math.max(0, at - 2));
      x.set(here.x);
      y.set(here.y);
      rotate.set((Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI + 90);
      if (!reduce) setReached(geo.stops.filter((s) => here.y / geo.height >= s - 0.01).length);
    },
    [geo, reduce, x, y, rotate],
  );

  useLayoutEffect(() => place(drawn.get()), [place, drawn]);
  useMotionValueEvent(drawn, 'change', place);

  return (
    <section id="story" className={`section ${styles.story}`} aria-labelledby="story-title">
      <div className={styles.watermark} aria-hidden="true">
        ข้าวสาร
      </div>
      <div className="wrap">
        <header className={styles.head}>
          <span className="kicker">the story</span>
          <h2 id="story-title" className="section-title">
            Khaosan Road <span className={styles.arrow}>→</span> <span className="accent">Tooting</span>
          </h2>
        </header>

        <div ref={trackRef} className={styles.track}>
          {geo && (
            <svg className={styles.route} width={geo.width} height={geo.height} aria-hidden="true">
              <path ref={routeRef} d={geo.d} className={styles.planned} />
              <motion.path d={geo.d} className={styles.road} style={{ pathLength: drawn }} />
            </svg>
          )}

          {geo && (
            <motion.div className={styles.tuk} style={{ x, y, rotate }} aria-hidden="true">
              <TukTuk />
            </motion.div>
          )}

          <ol className={styles.beats}>
            {BEATS.map((beat, i) => (
              <li key={beat.title} className={styles.beat} data-reached={i < reached}>
                <span
                  className={styles.marker}
                  ref={(el) => {
                    if (el) markerRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                />
                <motion.div
                  className={styles.card}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -18% 0px' }}
                  transition={{ type: 'spring', stiffness: 110, damping: 18 }}
                >
                  {beat.sign && <Sign sign={beat.sign} />}
                  <h3 className={styles.beatTitle}>{beat.title}</h3>
                  <p className={styles.beatBody}>{beat.body}</p>
                  {beat.photo && hasPhoto('story') && (
                    <Photo
                      slot="story"
                      alt="A corner of the dining room: plank walls, garlands and a green tufted banquette"
                      sizes="(min-width: 900px) 520px, 90vw"
                      focus="50% 45%"
                      className={styles.photo}
                    />
                  )}
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Bangkok's blue street signs at one end, a London nameplate at the other. */
function Sign({ sign }: { sign: StreetSign }) {
  return (
    <div className={styles.signWrap}>
      {sign.kind === 'bkk' ? (
        <p className={styles.bkk}>
          <span lang="th">{sign.thai}</span>
          <span>{sign.roman}</span>
        </p>
      ) : (
        <p className={styles.ldn}>
          <span>{sign.name}</span> <span className={styles.district}>{sign.district}</span>
        </p>
      )}
      <span className={styles.coord}>{sign.coord}</span>
    </div>
  );
}

/** Tuk-tuk seen from above, nose pointing up. */
function TukTuk() {
  return (
    <svg viewBox="0 0 32 48" width="30" height="45">
      <rect x="1.5" y="31" width="5" height="10" rx="2" fill="var(--olive-deep)" />
      <rect x="25.5" y="31" width="5" height="10" rx="2" fill="var(--olive-deep)" />
      <rect x="13.5" y="1" width="5" height="9" rx="2" fill="var(--olive-deep)" />
      <path d="M10 9Q16 4 22 9L27 39Q16 44 5 39Z" fill="var(--cream)" />
      <rect x="6.5" y="15" width="19" height="24" rx="5" fill="var(--terracotta)" />
      <path d="M9 21h14M9 27h14M9 33h14" stroke="rgba(255,255,255,.4)" strokeWidth="1.5" />
      <circle cx="16" cy="8.5" r="1.8" fill="#fff7e8" />
    </svg>
  );
}
