/* Hero.jsx — Premium upgrade with AI background, magnetic buttons, resume download */
import React, { useRef, useEffect } from 'react';
import styles from './Hero.module.css';
import { useTypewriter } from '../../hooks/useTypewriter';
import { useCountUp }    from '../../hooks/useCountUp';
import AIBackground      from '../AIBackground/AIBackground';
import { personal, stats, heroBadges } from '../../data';

function StatCard({ value, suffix, label }) {
  const { count, ref } = useCountUp(value, 1800);
  return (
    <div className={styles.statCard} ref={ref}>
      <div className={styles.statNum}>{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

/* Magnetic hover — pulls button toward cursor */
function useMagnetic(strength = 0.28) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const move  = e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*strength}px,${(e.clientY-r.top-r.height/2)*strength}px)`; };
    const leave = ()=> { el.style.transition='transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'; el.style.transform='translate(0,0)'; };
    const enter = ()=> { el.style.transition='transform 0.12s ease-out'; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mouseenter', enter);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); el.removeEventListener('mouseenter', enter); };
  }, [strength]);
  return ref;
}

function downloadResume() {
  const url = personal.resumeUrl;
  if (!url || url === '#') { alert('Add your resume PDF URL to personal.resumeUrl in data.js'); return; }
  const a = document.createElement('a');
  a.href = url; a.download = 'Vanshika_Agrawal_Resume.pdf'; a.target = '_blank'; a.rel = 'noopener noreferrer';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

export default function Hero() {
  const role = useTypewriter(personal.roles, 78, 40, 2200);
  const b1   = useMagnetic(); const b2 = useMagnetic();

  return (
    <section id="hero" className={styles.hero}>
      <AIBackground />
      <div className={styles.dotGrid} aria-hidden="true" />
      <div className={styles.glow1} aria-hidden="true" />
      <div className={styles.glow2} aria-hidden="true" />

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div className={styles.grid}>

          <div className={styles.left}>
            <p className={styles.greeting}><span className={styles.greetingDot}/> Available for opportunities · 2026</p>
            <h1 className={styles.name}>{personal.name}</h1>
            <div className={styles.roleRow}>
              <span className={styles.rolePrompt}>&gt;</span>
              <span>{role}</span>
              <span className={styles.cursor} aria-hidden="true" />
            </div>
            <p className={styles.bio}>{personal.tagline}</p>

            <div className={styles.badges}>
              {heroBadges.map(b => (
                <span key={b.label} className={styles.badge}>
                  <span className={styles.badgeIcon}>{b.icon}</span>
                  <span className={styles.badgeValue}>{b.value}</span>
                  <span className={styles.badgeSep}>·</span>
                  <span className={styles.badgeLabel}>{b.label}</span>
                </span>
              ))}
            </div>

            <div className={styles.ctas}>
              <div ref={b1} style={{display:'inline-block'}}>
                <button className={styles.btnPrimary} onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>
                  View Projects <span className={styles.btnArrow}>→</span>
                </button>
              </div>
              <div ref={b2} style={{display:'inline-block'}}>
                <button className={styles.btnOutline} onClick={downloadResume}>
                  ⬇ Download Resume
                </button>
              </div>
            </div>

            <div className={styles.stats}>
              {stats.map(s => <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} />)}
            </div>
          </div>

          <div className={styles.right} aria-hidden="true">
            <div className={styles.terminal}>
              <div className={styles.termBar}>
                <span className={styles.termDot} style={{background:'#FF5F56'}} />
                <span className={styles.termDot} style={{background:'#FFBD2E'}} />
                <span className={styles.termDot} style={{background:'#27C93F'}} />
                <span className={styles.termTitle}>vanshika.config.js</span>
              </div>
              <div className={styles.termBody}>
                <div><span className={styles.tc}>// Portfolio · 2026</span></div>
                <div><span className={styles.tk}>export default</span> {'{'}</div>
                <div>&nbsp;&nbsp;<span className={styles.tk}>name</span><span className={styles.tp}>: </span><span className={styles.ts}>"Vanshika Agrawal"</span><span className={styles.tp}>,</span></div>
                <div>&nbsp;&nbsp;<span className={styles.tk}>sgpa</span><span className={styles.tp}>: </span><span className={styles.tn}>8.5</span><span className={styles.tp}>,  </span><span className={styles.tc}>// all sems</span></div>
                <div>&nbsp;&nbsp;<span className={styles.tk}>leetcode</span><span className={styles.tp}>: </span><span className={styles.tn}>150</span><span className={styles.tp}>,</span></div>
                <div>&nbsp;&nbsp;<span className={styles.tk}>stack</span><span className={styles.tp}>: [</span><span className={styles.ts}>"Node"</span><span className={styles.tp}>,</span><span className={styles.ts}>"React"</span><span className={styles.tp}>,</span><span className={styles.ts}>"MongoDB"</span><span className={styles.tp}>],</span></div>
                <div>&nbsp;&nbsp;<span className={styles.tk}>openToWork</span><span className={styles.tp}>: </span><span style={{color:'#27C93F'}}>true</span></div>
                <div>{'}'}</div>
              </div>
            </div>
            <div className={styles.statusChip}><span className={styles.statusDot}/>Open to internship &amp; placement offers</div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLine}/>
        <span className={styles.scrollLabel}>scroll</span>
      </div>
    </section>
  );
}
