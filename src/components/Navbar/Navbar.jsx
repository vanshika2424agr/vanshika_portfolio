import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Navbar.module.css';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { personal } from '../../data';

const NAV_LINKS = [
  { label: 'About',    target: 'about'          },
  { label: 'Education',      target: 'education'       },
  { label: 'DSA',      target: 'problem-solving' },
  { label: 'Projects', target: 'projects'        },
  { label: 'Certifications',    target: 'certifications'  },
  { label: 'Contact',  target: 'contact'         },
];

const SECTION_IDS = NAV_LINKS.map(l => l.target);

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]   = useState(false);
  const drawerRef   = useRef(null);
  const hamburgerRef = useRef(null);


  const activeId = useScrollSpy(SECTION_IDS, {
    topOffset:     72,  
    heroThreshold: 80, 
  });

  /* ── Glass navbar on scroll ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close drawer on Escape key ── */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus(); // return focus to trigger
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  /* ── Prevent body scroll when mobile drawer open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── Smooth scroll to section ── */
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Offset for fixed navbar height
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  const toggleMenu = () => setMenuOpen(m => !m);

  return (
    <>
      {/* ── Skip to main content (a11y: WCAG 2.4.1) ── */}
      <a href="#hero" className={styles.skipLink}>
        Skip to main content
      </a>
      <nav
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.inner}>

          {/* Desktop links */}
          <div className={styles.navLinks} role="list">
            {NAV_LINKS.map(link => {
              const isActive = activeId === link.target;
              return (
                <div key={link.target} role="listitem">
                  <button
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => scrollTo(link.target)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`Navigate to ${link.target} section`}
                  >
                    {link.label}
                    {/* Animated underline indicator */}
                    <span
                      className={styles.indicator}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              );
            })}
          </div>


          {/* Hamburger — mobile only */}
          <button
            ref={hamburgerRef}
            className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        id="mobile-nav"
        ref={drawerRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? '' : undefined}
      >
        <nav>
          {NAV_LINKS.map((link, i) => {
            const isActive = activeId === link.target;
            return (
              <button
                key={link.target}
                className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
                onClick={() => scrollTo(link.target)}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={menuOpen ? 0 : -1}
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
              >
                <span className={styles.mobileLinkDot} aria-hidden="true" />
                {link.label}
                {isActive && (
                  <span className={styles.mobileActiveChip} aria-hidden="true">
                    active
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <a
          href="My Resume.pdf"
          className={styles.mobileResume}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Download resume (opens in new tab)"
        >
          Download Resume ↗
        </a>
      </div>

      {/* Backdrop overlay — closes drawer on click */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
