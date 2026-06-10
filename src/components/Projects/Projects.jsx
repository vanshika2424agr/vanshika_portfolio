import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import styles from './Projects.module.css';
import EmptyState from './EmptyState';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { projects, personal } from '../../data';

/* ── Badge colour map ── */
const BADGE_STYLES = {
  amber:   { background:'var(--amber-dim)',   color:'var(--amber)',   border:'1px solid rgba(245,158,11,0.3)' },
  cyan:    { background:'var(--cyan-dim)',     color:'var(--cyan)',    border:'1px solid var(--border-cyan)'   },
  violet:  { background:'var(--violet-dim)',   color:'#a78bfa',       border:'1px solid var(--border-violet)' },
  emerald: { background:'var(--emerald-dim)', color:'var(--emerald)', border:'1px solid rgba(16,185,129,0.3)' },
};

/* ── Derive filter categories from data (All + unique badges) ── */
const ALL_FILTERS = ['All', ...Array.from(new Set(projects.map(p => p.badge)))];

/* ── Single project card ── */
function ProjectCard({ project, animDelay }) {
  const reduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <article
      className={styles.card}
      style={reduced ? {} : { animationDelay: `${animDelay}ms` }}
      /* Cards are articles so screen readers understand they're discrete items */
    >
      <div>
        <span className={styles.badge} style={BADGE_STYLES[project.badgeColor] || BADGE_STYLES.cyan}>
          {project.badge}
        </span>
      </div>
      <h3 className={styles.projectName}>{project.name}</h3>
      <p className={styles.tagline}>{project.tagline}</p>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.techRow} aria-label="Technologies used">
        {project.tech.map(t => (
          <span key={t} className={styles.techPill}>{t}</span>
        ))}
      </div>
      <div className={styles.links}>
        <a
          href={project.github}
          className={styles.linkBtn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.name} source code on GitHub (opens in new tab)`}
        >
          ⬡ GitHub
        </a>
        {project.live && (
          <a
            href={project.live}
            className={`${styles.linkBtn} ${styles.linkBtnLive}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.name} live demo (opens in new tab)`}
          >
            ↗ Live
          </a>
        )}
      </div>
    </article>
  );
}

/* ── Filter tab bar with roving tabindex ── */
function FilterBar({ filters, active, onChange }) {
  const tabRefs = useRef([]);

  /* Keyboard: Left/Right arrows move focus between filter tabs (roving tabindex) */
  const handleKeyDown = useCallback((e, index) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (index + 1) % filters.length;
    if (e.key === 'ArrowLeft')  next = (index - 1 + filters.length) % filters.length;
    if (e.key === 'Home')       next = 0;
    if (e.key === 'End')        next = filters.length - 1;

    if (next !== -1) {
      e.preventDefault();
      tabRefs.current[next]?.focus();
      onChange(filters[next]);
    }

    /* Enter / Space already fire onClick natively for buttons */
  }, [filters, onChange]);

  return (
    <div
      className={styles.filters}
      role="tablist"
      aria-label="Filter projects by category"
    >
      {filters.map((f, i) => {
        const isActive = active === f;
        const count = f === 'All'
          ? projects.length
          : projects.filter(p => p.badge === f).length;

        return (
          <button
            key={f}
            ref={el => { tabRefs.current[i] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-controls="projects-grid"
            /* Roving tabindex: only the active tab is reachable via Tab key.
               All tabs are reachable via arrow keys (see handleKeyDown). */
            tabIndex={isActive ? 0 : -1}
            className={`${styles.filterBtn} ${isActive ? styles.filterActive : ''}`}
            onClick={() => onChange(f)}
            onKeyDown={e => handleKeyDown(e, i)}
          >
            {f}
            {f !== 'All' && (
              <span className={styles.filterCount} aria-hidden="true">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Main component ── */
export default function Projects() {
  const headRef    = useScrollReveal();
  const [active, setActive] = useState('All');

  /* Announcement ref for screen reader live region */
  const announcerRef = useRef(null);

  /* Derive filtered sets */
  const filtered = useMemo(() =>
    active === 'All' ? projects : projects.filter(p => p.badge === active),
    [active]
  );

  const featured  = filtered.find(p => p.featured);
  const standard  = filtered.filter(p => !p.featured);
  const isEmpty   = filtered.length === 0;

  /* When filter changes, update the live region so screen readers announce result count */
  useEffect(() => {
    if (!announcerRef.current) return;
    const msg = isEmpty
      ? `No projects found for filter: ${active}`
      : `Showing ${filtered.length} project${filtered.length !== 1 ? 's' : ''} for: ${active}`;
    announcerRef.current.textContent = msg;
  }, [active, filtered.length, isEmpty]);

  const handleFilterChange = (f) => {
    setActive(f);
  };

  return (
    <section id="projects" className="section-wrapper section-alt">
      <div className="container">

        {/* Visually-hidden live region for screen reader announcements */}
        <div
          ref={announcerRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={styles.srOnly}
        />

        <div ref={headRef} className="reveal">
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-sub">
            Four projects. Four problems solved. Each one a little harder than the last.
          </p>
        </div>

        {/* ── Filter tab bar ── */}
        <FilterBar
          filters={ALL_FILTERS}
          active={active}
          onChange={handleFilterChange}
        />

        {/* ── Project grid / empty state ── */}
        <div
          id="projects-grid"
          className={styles.grid}
          role="tabpanel"
          aria-label={`Projects filtered by: ${active}`}
        >
          {isEmpty ? (
            <EmptyState
              activeFilter={active !== 'All' ? active : null}
              onReset={() => setActive('All')}
            />
          ) : (
            <>
              {/* Featured card — full width */}
              {featured && (
                <div
                  key={`featured-${active}`}
                  className={`${styles.cardFeatured} ${styles.cardEnter}`}
                >
                  <div>
                    <div className={styles.badgeRow}>
                      <span
                        className={styles.badge}
                        style={BADGE_STYLES[featured.badgeColor] || BADGE_STYLES.cyan}
                      >
                        ⭐ {featured.badge}
                      </span>
                      <span className={styles.tag} style={{ color:'var(--cyan)' }}>
                        // AI · Child Safety · Backend
                      </span>
                    </div>
                    <h3 className={styles.projectName}>{featured.name}</h3>
                    <p className={styles.tagline}>{featured.tagline}</p>
                    <p className={styles.description}>{featured.description}</p>
                    <div className={styles.techRow} aria-label="Technologies used">
                      {featured.tech.map(t => (
                        <span key={t} className={styles.techPill}>{t}</span>
                      ))}
                    </div>
                    <div className={styles.links}>
                      <a
                        href={featured.github}
                        className={styles.linkBtn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${featured.name} on GitHub (opens in new tab)`}
                      >
                        ⬡ GitHub
                      </a>
                      {featured.live && (
                        <a
                          href={featured.live}
                          className={`${styles.linkBtn} ${styles.linkBtnLive}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${featured.name} live demo (opens in new tab)`}
                        >
                          ↗ Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Decorative code block */}
                  <div className={styles.featuredVisual} aria-hidden="true">
                    <div className={styles.codeComment}>// KidShield AI — core logic</div>
                    <div><span className={styles.codeKey}>async function</span> <span className={styles.codeVal}>classify</span>(input) {'{'}</div>
                    <div>&nbsp;&nbsp;<span className={styles.codeComment}>// Stage 1: intent detection</span></div>
                    <div>&nbsp;&nbsp;<span className={styles.codeKey}>const</span> intent = <span className={styles.codeKey}>await</span></div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;genAI.<span className={styles.codeVal}>detect</span>(input);</div>
                    <div>&nbsp;</div>
                    <div>&nbsp;&nbsp;<span className={styles.codeComment}>// Stage 2: severity scoring</span></div>
                    <div>&nbsp;&nbsp;<span className={styles.codeKey}>if</span> (intent.harmful) {'{'}</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className={styles.codeKey}>return</span> {'{'} score: <span style={{color:'#d19a66'}}>0.97</span>, action: <span className={styles.codeVal}>"flag"</span> {'}'}</div>
                    <div>&nbsp;&nbsp;{'}'}</div>
                    <div>{'}'}</div>
                  </div>
                </div>
              )}

              {/* Standard cards */}
              {standard.map((p, i) => (
                <ProjectCard
                  key={`${p.id}-${active}`}
                  project={p}
                  animDelay={featured ? (i + 1) * 60 : i * 60}
                />
              ))}
            </>
          )}
        </div>

        {/* View all on GitHub */}
        <div className={styles.viewAll}>
          <a
            href={`https://${personal.github}`}
            className={styles.viewAllBtn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View all repositories on GitHub (opens in new tab)"
          >
            View All on GitHub →
          </a>
        </div>

      </div>
    </section>
  );
}
