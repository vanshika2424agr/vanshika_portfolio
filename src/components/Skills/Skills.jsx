import React from 'react';
import styles from './Skills.module.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { skillGroups } from '../../data';

const COLOR_MAP = {
  cyan:    { dot: 'var(--cyan)',    label: 'var(--cyan)'    },
  violet:  { dot: 'var(--violet)', label: '#a78bfa'        },
  amber:   { dot: 'var(--amber)',   label: 'var(--amber)'   },
  emerald: { dot: 'var(--emerald)', label: 'var(--emerald)' },
};

export default function Skills() {
  const headRef  = useScrollReveal();
  const bodyRef  = useScrollReveal(0.1);

  return (
    <section id="skills" className="section-wrapper section-alt">
      <div className="container">
        <div ref={headRef} className="reveal">
          {/* <p className="section-label">// 02_tech_stack</p> */}
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-sub">What I reach for when I sit down to build.</p>
        </div>

        <div ref={bodyRef} className="reveal">
          {skillGroups.map((group) => {
            const colors = COLOR_MAP[group.color] || COLOR_MAP.cyan;
            return (
              <div key={group.category} className={styles.skillGroup}>
                <div className={styles.groupHeader}>
                  <span className={styles.groupLabel} style={{ color: colors.label }}>
                    {group.category}
                  </span>
                  <div className={styles.groupLine} />
                </div>
                <div className={styles.pills}>
                  {group.skills.map(skill => (
                    <span key={skill} className={styles.pill}>
                      <span className={styles.pillDot} style={{ background: colors.dot }} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
