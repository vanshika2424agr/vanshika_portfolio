/* ============================================================
   ProblemSolving.jsx
   Premium statistics dashboard for DSA / LeetCode progress.
   Features:
   - Animated SVG donut chart (difficulty breakdown)
   - Animated topic progress bars (staggered)
   - Meta stat cards (streak, goal, focus)
   - All animations trigger on viewport entry
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import styles from './ProblemSolving.module.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { problemSolving } from '../../data';

/* ── Color map for difficulty / topic colors ── */
const COLORS = {
  emerald: { fill: 'var(--emerald)', track: 'rgba(16,185,129,0.15)' },
  amber:   { fill: 'var(--amber)',   track: 'rgba(245,158,11,0.15)'  },
  red:     { fill: '#EF4444',        track: 'rgba(239,68,68,0.15)'   },
  cyan:    { fill: 'var(--cyan)',    track: 'var(--cyan-dim)'         },
  violet:  { fill: 'var(--violet)', track: 'var(--violet-dim)'       },
};

/* ── Animated donut segment ── */
const RADIUS  = 68;
const CIRC    = 2 * Math.PI * RADIUS;          // ≈ 427.3
const CX = 80, CY = 80;

function DonutChart({ breakdown, visible }) {
  /* Build cumulative offsets for each segment */
  let cumulative = 0;
  const segments = breakdown.map(d => {
    const len    = (d.pct / 100) * CIRC;
    const offset = CIRC - cumulative;          // SVG dash-offset logic
    cumulative  += len;
    return { ...d, len, offset };
  });

  return (
    <svg
      className={styles.donutSvg}
      width="160" height="160"
      viewBox="0 0 160 160"
    >
      {/* Track circle */}
      <circle
        cx={CX} cy={CY} r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="14"
      />
      {/* Segments */}
      {segments.map((seg, i) => (
        <circle
          key={seg.difficulty}
          cx={CX} cy={CY} r={RADIUS}
          fill="none"
          stroke={COLORS[seg.color]?.fill || '#888'}
          strokeWidth="14"
          strokeDasharray={`${visible ? seg.len : 0} ${CIRC}`}
          strokeDashoffset={seg.offset}
          strokeLinecap="round"
          style={{ transition: `stroke-dasharray 1.2s cubic-bezier(0,0,0.2,1) ${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

/* ── Animated topic bar ── */
function TopicBar({ topic, visible, delay }) {
  const pct = Math.round((topic.solved / topic.total) * 100);
  const c   = COLORS[topic.color] || COLORS.cyan;
  return (
    <div className={styles.topicCard}>
      <div className={styles.topicTop}>
        <div className={styles.topicName}>
          <span className={styles.topicGlyph} style={{ color: c.fill }}>{topic.icon}</span>
          {topic.name}
        </div>
        <span className={styles.topicCount} style={{ color: c.fill }}>
          {topic.solved}/{topic.total}
        </span>
      </div>
      <div className={styles.topicBar}>
        <div
          className={styles.topicFill}
          style={{
            width: visible ? `${pct}%` : '0%',
            background: c.fill,
            '--delay': `${delay}s`,
          }}
        />
      </div>
      <div className={styles.topicMeta}>
        <span>{pct}% complete</span>
        <span>{topic.total - topic.solved} remaining</span>
      </div>
    </div>
  );
}

export default function ProblemSolving() {
  const headRef    = useScrollReveal();
  const summaryRef = useScrollReveal(0.1);
  const topicRef   = useScrollReveal(0.05);

  /* Track visibility for animations */
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [topicsVisible,  setTopicsVisible]  = useState(false);
  const sumEl = useRef(null);
  const topEl = useRef(null);

  useEffect(() => {
    const obs = (el, setter) => {
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setter(true); o.disconnect(); } }, { threshold: 0.1 });
      o.observe(el);
      return o;
    };
    const o1 = obs(sumEl.current, setSummaryVisible);
    const o2 = obs(topEl.current, setTopicsVisible);
    return () => { o1?.disconnect(); o2?.disconnect(); };
  }, []);

  const { breakdown, topics, totalSolved, targetGoal, streakDays, contestRating, focus, badges } = problemSolving;

  return (
    <section id="problem-solving" className="section-wrapper">
      <div className="container">

        {/* Header */}
        <div ref={headRef} className="reveal">
          <h2 className="section-title">Problem Solving</h2>
          <p className="section-sub">
            150+ LeetCode problems solved — from arrays to dynamic programming.
            Building the algorithmic foundation for top-company interviews.
          </p>
        </div>

        {/* Summary row: donut + meta cards */}
        <div ref={sumEl} className={styles.summaryRow}>

          {/* Donut chart card */}
          <div className={styles.donutCard}>
            <div className={styles.donutWrap}>
              <DonutChart breakdown={breakdown} visible={summaryVisible} />
              <div className={styles.donutCenter}>
                <div className={styles.donutTotal}>{totalSolved}+</div>
                <div className={styles.donutSub}>solved</div>
              </div>
            </div>

            {/* Legend */}
            <div className={styles.donutLegend}>
              {breakdown.map(d => (
                <div key={d.difficulty} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: COLORS[d.color]?.fill }} />
                  <span className={styles.legendName}>{d.difficulty}</span>
                  <span className={styles.legendCount}>{d.solved}</span>
                  <span className={styles.legendPct}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta stat cards */}
          <div className={styles.metaGrid}>
            <div className={styles.metaCard}>
              <div className={styles.metaIcon}>🔥</div>
              <div className={styles.metaValue}>{streakDays}d</div>
              <div className={styles.metaLabel}>Active Streak</div>
              <div className={styles.metaNote}>Consistent daily practice building problem-solving intuition</div>
            </div>

            <div className={styles.metaCard}>
              <div className={styles.metaIcon}>🎯</div>
              <div className={styles.metaValue}>{targetGoal}</div>
              <div className={styles.metaLabel}>Goal</div>
              <div className={styles.metaNote}>Target total problems — currently {Math.round((totalSolved/targetGoal)*100)}% of the way there</div>
              <div className={styles.diffBar}>
                <div className={styles.diffBarTrack}>
                  <div
                    className={styles.diffBarFill}
                    style={{
                      width: summaryVisible ? `${Math.round((totalSolved/targetGoal)*100)}%` : '0%',
                      background: 'var(--cyan)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.metaCard}>
              <div className={styles.metaIcon}>📈</div>
              <div className={styles.metaValue} style={{ fontSize: 17 }}>Medium Focus</div>
              <div className={styles.metaLabel}>Current Level</div>
              <div className={styles.metaNote}>{breakdown[1].solved} medium problems solved — strongest growth area</div>
              <div className={styles.diffBar}>
                <div className={styles.diffBarTrack}>
                  <div
                    className={styles.diffBarFill}
                    style={{
                      width: summaryVisible ? `${breakdown[1].pct}%` : '0%',
                      background: 'var(--amber)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.metaCard}>
              <div className={styles.metaIcon}>📚</div>
              <div className={styles.metaValue} style={{ fontSize: 14, lineHeight: 1.3 }}>NeetCode · Striver</div>
              <div className={styles.metaLabel}>Study Roadmap</div>
              <div className={styles.metaNote}>{focus}</div>
            </div>

            {/* Earned badges */}
            {badges.map(b => (
              <div key={b} className={styles.metaCard}>
                <div className={styles.metaIcon}>🏅</div>
                <div className={styles.metaValue} style={{ fontSize: 14 }}>{b}</div>
                <div className={styles.metaLabel}>Achievement Badge</div>
                <div className={styles.metaNote}>Awarded by LeetCode for consistent practice</div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus badges */}
        <div className={styles.focusRow}>
          <span className={styles.focusBadge}>⚡ LeetCode · 150+ Solved</span>
          <span className={styles.focusBadge}>📖 NeetCode 150 Roadmap</span>
          <span className={styles.focusBadge}>🏹 Striver SDE Sheet</span>
          <span className={styles.focusBadge}>🔥 {streakDays}-Day Streak</span>
          {badges.map(b => (
            <span key={b} className={styles.focusBadge}>🏅 {b}</span>
          ))}
        </div>

      </div>
    </section>
  );
}
