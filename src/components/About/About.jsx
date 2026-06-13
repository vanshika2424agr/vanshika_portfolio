import React from 'react';
import styles from './About.module.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { personal } from '../../data';
import profileImage from "../../../dist/Vanshika Agrawal(1)(2).jpeg";

export default function About() {
  const leftRef  = useScrollReveal(0.15);
  const rightRef = useScrollReveal(0.15);

  return (
    <section id="about" className={`section-wrapper ${styles.about}`}>
      <div className="container">
        <div className={styles.grid}>

          {/* Left: Avatar card */}
          <div ref={leftRef} className="reveal">
            <div className={styles.avatarCard}>
             <div className={styles.avatarInner}>

  <div className={styles.avatarName}>
    Vanshika Agrawal
  </div>

  <div className={styles.avatarTitle}>
    Backend Developer · AI Engineer
  </div>

  <img
    src={profileImage}
    alt="Vanshika Agrawal"
    className={styles.profileImage}
  />

  <div className={styles.termCard}>
                  <div className={styles.factLine}>
                    <span className={styles.factPrompt}>$</span>
                    <span>B.Tech CSE · UCER · 2028</span>
                  </div>
                  <div className={styles.factLine}>
                    <span className={styles.factPrompt}>$</span>
                    <span>Prayagraj, India</span>
                  </div>
                  <div className={styles.factLine}>
                    <span className={styles.factPrompt}>$</span>
                    <span style={{ color: '#10B981' }}>Open to Work ✓</span>
                  </div>
                  <div className={styles.factLine}>
                    <span className={styles.factPrompt}>$</span>
                    <span>{personal.currently}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio text */}
          <div ref={rightRef} className="reveal">
            <h2 className="section-title">Who Am I?</h2>
            <p className="section-sub">Not just a student. A builder with real-world experience.</p>

            <div className={styles.bios}>
              {personal.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <button
              className={styles.ctaBtn}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Let's Connect →
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
