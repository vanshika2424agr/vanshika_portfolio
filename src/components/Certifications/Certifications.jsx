import React from 'react';
import styles from './Certifications.module.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { certifications } from '../../data';

/* Icon map — simple emoji fallbacks (replace with Lucide icons if preferred) */
const ICONS = {
  trophy:   '🏆',
  bot:      '🤖',
  zap:      '⚡',
  code:     '💻',
  terminal: '⌨️',
  users:    '👥',
  users:    '👥',
};

const COLOR_MAP = {
  amber:   { badge: { bg: 'var(--amber-dim)',   color: 'var(--amber)',   border: '1px solid rgba(245,158,11,0.3)' }, icon: { bg: 'var(--amber-dim)' } },
  cyan:    { badge: { bg: 'var(--cyan-dim)',     color: 'var(--cyan)',    border: '1px solid var(--border-cyan)'  }, icon: { bg: 'var(--cyan-dim)'   } },
  violet:  { badge: { bg: 'var(--violet-dim)',   color: '#a78bfa',       border: '1px solid var(--border-violet)'}, icon: { bg: 'var(--violet-dim)' } },
  emerald: { badge: { bg: 'var(--emerald-dim)',  color: 'var(--emerald)', border: '1px solid rgba(16,185,129,0.3)' }, icon: { bg: 'var(--emerald-dim)' } },
};

export default function Certifications() {
  const headRef = useScrollReveal();
  const gridRef = useScrollReveal(0.05);

  return (
    <section id="certifications" className="section-wrapper">
      <div className="container">
        <div ref={headRef} className="reveal">
          <h2 className="section-title">Certifications & Credentials</h2>
          <p className="section-sub">Learning never stops — here's proof.</p>
        </div>

        <div ref={gridRef} className={`reveal-grid ${styles.grid}`}>
          {certifications.map((cert) => {
            const c = COLOR_MAP[cert.color] || COLOR_MAP.cyan;
            const isFeatured = cert.color === 'amber';

            return (
              <div
                key={cert.name}
                className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className={styles.iconWrap} style={c.icon}>
                    {ICONS[cert.icon] || '📜'}
                  </div>
                  <span className={styles.year}>{cert.year}</span>
                </div>
                <span className={styles.badge} style={c.badge}>{cert.type}</span>
                <div className={styles.certName}>{cert.name}</div>
                <div className={styles.issuer}>{cert.issuer}</div>
                <p className={styles.description}>{cert.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
