import React from 'react';
import styles from './Footer.module.css';
import { personal } from '../../data';

const NAV_LINKS = [
  { label: 'About',    target: 'about' },
  { label: 'Skills',   target: 'skills' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact',  target: 'contact' },
];

const SOCIAL_LINKS = [
  { icon: '⬡',  label: 'GitHub',   href: `https://${personal.github}` },
  { icon: '💼', label: 'LinkedIn', href: `https://${personal.linkedin}` },
  { icon: '✉️', label: 'Email',    href: `mailto:${personal.email}` },
];

export default function Footer() {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>

          {/* Brand */}
          <div>
            <div className={styles.brand}>Vanshika Agrawal</div>
            <div className={styles.brandSub}>
              Backend Developer · AI Engineer · Perpetual Learner
            </div>
          </div>

          {/* Nav links */}
          <div className={styles.navLinks}>
            {NAV_LINKS.map(l => (
              <button key={l.target} className={styles.navLink} onClick={() => scrollTo(l.target)}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Social icons */}
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                className={styles.socialBtn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            Designed & built with intention by Vanshika Agrawal · {new Date().getFullYear()}
          </p>
          <button
            className={styles.backTop}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
