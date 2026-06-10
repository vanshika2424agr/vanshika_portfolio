import React from 'react';
import styles from './Experience.module.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { experiences } from '../../data';

const DOT_COLORS = {
  cyan:   'var(--cyan)',
  violet: 'var(--violet)',
};

const CHIP_STYLES = {
  cyan:   { background: 'var(--cyan-dim)',   color: 'var(--cyan)',   border: '1px solid var(--border-cyan)' },
  violet: { background: 'var(--violet-dim)', color: '#a78bfa',      border: '1px solid var(--border-violet)' },
};

export default function Experience() {
  const headRef = useScrollReveal();
  const bodyRef = useScrollReveal(0.1);

  return (
    <section id="experience" className="section-wrapper">
      <div className="container">
        <div ref={headRef} className="reveal">
          <h2 className="section-title">Work Experience</h2>
          <p className="section-sub">Two internships. Two completely different skill sets. One stronger engineer.</p>
        </div>

        <div ref={bodyRef} className={`reveal ${styles.timeline}`}>
          {experiences.map((exp) => (
            <div key={exp.company} className={styles.item}>
              {/* Timeline node */}
              <div
                className={styles.dot}
                style={{ background: DOT_COLORS[exp.color] || DOT_COLORS.cyan }}
              />

              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <div className={styles.role}>{exp.role}</div>
                    <div className={styles.company} style={{ color: DOT_COLORS[exp.color] || DOT_COLORS.cyan }}>
                      {exp.fullName}
                    </div>
                  </div>
                  <div>
                    <span className={styles.chip} style={CHIP_STYLES[exp.color] || CHIP_STYLES.cyan}>
                      {exp.duration}
                    </span>
                  </div>
                </div>

                <div className={styles.bullets}>
                  {exp.highlights.map((h, i) => (
                    <div key={i} className={styles.bullet}>
                      <span className={styles.bulletDot}>›</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
