import { useEffect, useState } from 'react';
import { londonTime, type LondonTime } from './hours';

/** Current Europe/London weekday/time, refreshed every 30 seconds. */
export function useLondonTime(): LondonTime {
  const [now, setNow] = useState(() => londonTime(new Date()));

  useEffect(() => {
    const tick = () => setNow(londonTime(new Date()));
    const id = window.setInterval(tick, 30_000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  return now;
}
