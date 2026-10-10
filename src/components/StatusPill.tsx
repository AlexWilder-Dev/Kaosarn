import { openStatus } from '../lib/hours';
import { useLondonTime } from '../lib/useLondonTime';
import styles from './StatusPill.module.css';

export function StatusPill({ className }: { className?: string }) {
  const status = openStatus(useLondonTime());

  return (
    <p className={`${styles.pill} ${className ?? ''}`} data-kind={status.kind}>
      <span className={styles.dot} aria-hidden="true" />
      <strong>{status.label}</strong>
      {status.detail && <span className={styles.detail}>{status.detail}</span>}
    </p>
  );
}
