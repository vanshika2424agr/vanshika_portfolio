import React from 'react';
import styles from './Education.module.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { education } from '../../data';

export default function Education() {
  const headRef   = useScrollReveal();
  const cardRef   = useScrollReveal(0.1);
  const courseRef = useScrollReveal(0.1);

  return (
    <section id="education" className={`section-wrapper ${styles.education}`}>
      <div className="container">

        {/* Section header */}
        <div ref={headRef} className="reveal">
          <h2 className="section-title">Academic Background</h2>
          <p className="section-sub">
            Consistent academic performance that backs up every project in this portfolio.
          </p>
        </div>

        {/* Main card */}
        <div ref={cardRef} className="reveal">
          <div className={styles.mainCard}>

            {/* Top: degree info + SGPA badge */}
            <div className={styles.cardTop}>
              <div className={styles.accentBar}>
                <div className={styles.degreeLabel}>// {education.duration}</div>
                <div className={styles.degree}>{education.degree}</div>
                <div className={styles.field}>{education.field}</div>
                <div className={styles.institution}>{education.institution}</div>
                <div className={styles.affiliation}>{education.location} · {education.affiliation}</div>
              </div>

              {/* SGPA prominence badge */}
              <div className={styles.sgpaBadge}>
                <div className={styles.sgpaValue}>{education.sgpa}</div>
                <div className={styles.sgpaLabel}>SGPA</div>
                <div className={styles.sgpaNote}>{education.sgpaNote}</div>
              </div>
            </div>

            {/* Highlight stats strip */}
            <div className={styles.highlights}>
              {education.highlights.map(h => (
                <div key={h.label} className={styles.hlItem}>
                  <div className={styles.hlIcon}>{h.icon}</div>
                  <div className={styles.hlValue}>{h.value}</div>
                  <div className={styles.hlLabel}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
