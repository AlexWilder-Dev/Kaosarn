// Opening hours and live open/closed status, always in Europe/London time.

export type Session = { open: string; close: string };

export type DayHours = {
  day: number; // 0 = Monday … 6 = Sunday
  short: string;
  long: string;
  sessions: Session[];
};

const lunchWeek: Session = { open: '12:00', close: '15:00' };
const lunchWeekend: Session = { open: '12:00', close: '15:30' };

// Monday isn't listed on the restaurant's site, so it's shown as closed.
export const HOURS: DayHours[] = [
  { day: 0, short: 'Mon', long: 'Monday', sessions: [] },
  { day: 1, short: 'Tue', long: 'Tuesday', sessions: [lunchWeek, { open: '17:30', close: '22:00' }] },
  { day: 2, short: 'Wed', long: 'Wednesday', sessions: [lunchWeek, { open: '17:30', close: '22:00' }] },
  { day: 3, short: 'Thu', long: 'Thursday', sessions: [lunchWeek, { open: '17:30', close: '22:00' }] },
  { day: 4, short: 'Fri', long: 'Friday', sessions: [lunchWeek, { open: '17:30', close: '22:30' }] },
  { day: 5, short: 'Sat', long: 'Saturday', sessions: [lunchWeekend, { open: '17:30', close: '22:30' }] },
  { day: 6, short: 'Sun', long: 'Sunday', sessions: [lunchWeekend, { open: '17:30', close: '21:30' }] },
];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const WEEKDAYS: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

const londonFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  weekday: 'short',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export type LondonTime = {
  day: number; // 0 = Monday
  minutes: number; // minutes since midnight
  isoDate: string; // YYYY-MM-DD
};

export function londonTime(date: Date): LondonTime {
  const parts = Object.fromEntries(londonFormat.formatToParts(date).map((p) => [p.type, p.value]));
  return {
    day: WEEKDAYS[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
  };
}

export type OpenStatus =
  | { kind: 'open'; label: string; detail: string }
  | { kind: 'later'; label: string; detail: string }
  | { kind: 'closed'; label: string; detail: string };

export function openStatus(now: LondonTime): OpenStatus {
  const today = HOURS[now.day];

  for (const s of today.sessions) {
    const open = toMinutes(s.open);
    const close = toMinutes(s.close);
    if (now.minutes >= open && now.minutes < close) {
      return { kind: 'open', label: 'Open now', detail: `until ${s.close}` };
    }
    if (now.minutes < open) {
      return { kind: 'later', label: `Opens ${s.open}`, detail: 'today' };
    }
  }

  // Nothing left today: find the next day with a session.
  for (let i = 1; i <= 7; i++) {
    const next = HOURS[(now.day + i) % 7];
    if (next.sessions.length) {
      const when = i === 1 ? 'tomorrow' : next.short;
      return {
        kind: 'closed',
        label: today.sessions.length ? 'Closed now' : 'Closed today',
        detail: `Opens ${when} ${next.sessions[0].open}`,
      };
    }
  }

  return { kind: 'closed', label: 'Closed today', detail: '' };
}

export const formatSessions = (sessions: Session[]) =>
  sessions.length ? sessions.map((s) => `${s.open}–${s.close}`).join(' · ') : 'Closed';
