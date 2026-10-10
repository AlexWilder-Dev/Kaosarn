import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { business, mailto } from '../data/business';
import { londonTime } from '../lib/hours';
import { Phone, Mail } from './Icons';
import styles from './EnquiryForm.module.css';

const OCCASIONS = ['Birthday', 'Celebration', 'Work do', 'Just because'];

type Values = { name: string; date: string; size: string; occasion: string; notes: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: '', date: '', size: '', occasion: 'Birthday', notes: '' };

const prettyDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

const isMonday = (iso: string) => !!iso && new Date(`${iso}T12:00:00`).getDay() === 1;

function validate(v: Values, today: string): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = 'Who should we ask for?';
  if (!v.date) errors.date = 'Pick a date.';
  else if (v.date < today) errors.date = 'That date has already been.';
  const size = Number(v.size);
  if (!v.size) errors.size = 'Roughly how many of you?';
  else if (!Number.isInteger(size) || size < 2) errors.size = 'Groups start at 2.';
  else if (size > 200) errors.size = 'That’s a big one. Give us a call instead.';
  return errors;
}

export function EnquiryForm() {
  const id = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Values | null>(null);
  const today = londonTime(new Date()).isoDate;

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values, today);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    // Front end only: nothing leaves the browser.
    setSent(values);
  };

  const field = (key: keyof Values) => ({
    id: `${id}-${key}`,
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  });

  const errorFor = (key: keyof Values) =>
    errors[key] && (
      <p id={`${id}-${key}-error`} className={styles.error}>
        {errors[key]}
      </p>
    );

  return (
    <div className={styles.card}>
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <Success
            key="done"
            values={sent}
            onReset={() => {
              setSent(null);
              setValues(EMPTY);
            }}
          />
        ) : (
          <motion.form
            key="form"
            className={styles.form}
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div>
              <h3 className={styles.title}>Plan a group night</h3>
              <p className={styles.intro}>Tell us the basics and we’ll take it from there.</p>
            </div>

            <div className={styles.field}>
              <label htmlFor={`${id}-name`}>Your name</label>
              <input
                {...field('name')}
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
              />
              {errorFor('name')}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor={`${id}-date`}>Date</label>
                <input
                  {...field('date')}
                  type="date"
                  min={today}
                  value={values.date}
                  onChange={(e) => set('date', e.target.value)}
                />
                {errorFor('date')}
                {!errors.date && isMonday(values.date) && (
                  <p className={styles.hint}>Heads up: we’re closed on Mondays.</p>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor={`${id}-size`}>Group size</label>
                <input
                  {...field('size')}
                  type="number"
                  inputMode="numeric"
                  min={2}
                  max={200}
                  placeholder="e.g. 12"
                  value={values.size}
                  onChange={(e) => set('size', e.target.value)}
                />
                {errorFor('size')}
              </div>
            </div>

            <fieldset className={styles.field}>
              <legend>Occasion</legend>
              <div className={styles.occasions}>
                {OCCASIONS.map((o) => (
                  <label key={o} className={styles.occasion}>
                    <input
                      type="radio"
                      name={`${id}-occasion`}
                      value={o}
                      checked={values.occasion === o}
                      onChange={() => set('occasion', o)}
                    />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.field}>
              <label htmlFor={`${id}-notes`}>
                Notes <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                {...field('notes')}
                rows={3}
                placeholder="Dietary needs, a cake, a time…"
                value={values.notes}
                onChange={(e) => set('notes', e.target.value)}
              />
            </div>

            <motion.button
              type="submit"
              className={`btn btn-primary ${styles.submit}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Send enquiry
            </motion.button>
            <p className={styles.demo}>Demo form: nothing is sent yet.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Success({ values, onReset }: { values: Values; onReset: () => void }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const first = values.name.trim().split(/\s+/)[0];
  const summary = `Table for ${values.size} on ${prettyDate(values.date)}${values.occasion ? ` (${values.occasion.toLowerCase()})` : ''}`;
  const body = [
    `Name: ${values.name}`,
    `Date: ${prettyDate(values.date)}`,
    `Group size: ${values.size}`,
    `Occasion: ${values.occasion}`,
    values.notes && `Notes: ${values.notes}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      className={styles.success}
      role="status"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      {!reduce && <Confetti />}
      <p className={styles.successKicker}>sorted!</p>
      <h3 className={styles.successTitle}>Nice one, {first}.</h3>
      <p className={styles.summary}>{summary}.</p>
      <p className={styles.successNote}>
        This is a demo, so nothing has actually been sent. To book for real, give the team a call or send this as an
        email.
      </p>
      <div className={styles.successActions}>
        <a className="btn btn-primary" href={business.phone.href}>
          <Phone /> Call {business.phone.display}
        </a>
        <a className="btn btn-secondary" href={mailto(`Group enquiry: ${summary}`, body)}>
          <Mail /> Email this enquiry
        </a>
        <button type="button" className="btn btn-quiet" onClick={onReset}>
          Start again
        </button>
      </div>
    </motion.div>
  );
}

const COLORS = ['var(--gold)', 'var(--cream)', 'var(--tag-h)'];

function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const dist = 90 + (i % 4) * 30;
        return (
          <motion.span
            key={i}
            style={{ background: COLORS[i % 3], borderRadius: i % 2 ? '50%' : '2px' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist + 40,
              opacity: 0,
              scale: 1,
              rotate: (i % 2 ? 1 : -1) * 220,
            }}
            transition={{ type: 'spring', stiffness: 60, damping: 12, opacity: { duration: 1.4, ease: 'easeIn' } }}
          />
        );
      })}
    </div>
  );
}
