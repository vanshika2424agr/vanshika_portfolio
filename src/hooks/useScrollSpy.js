/**
 * useScrollSpy.js
 * ─────────────────────────────────────────────────────────────
 * Production-grade scrollspy using IntersectionObserver.
 *
 * Design decisions (Google/Atlassian quality bar):
 *
 * 1. Uses a Map of intersection ratios rather than a single active flag,
 *    so when multiple sections are partially visible we always pick the
 *    one highest on the page — matching the user's reading position.
 *
 * 2. rootMargin shifts the detection window UP by nav-height so the
 *    active link switches the moment the section header hits the navbar,
 *    not when it reaches the viewport midpoint.
 *
 * 3. At the very top of the page (scrollY < threshold) we always return
 *    null — no nav link is highlighted when the hero is visible.
 *
 * 4. Near the bottom of the page the last section never hits a high
 *    intersection ratio, so we force-activate it when scrolled to bottom.
 *
 * 5. Cleans up all observers on unmount — no memory leaks.
 *
 * @param {string[]} sectionIds  - ordered list of section element IDs
 * @param {object}   options
 * @param {number}   options.topOffset      - px: how far below navbar to start detection (default 80)
 * @param {number}   options.heroThreshold  - px scrollY below which no item is active (default 100)
 * @returns {string|null} activeId - ID of the currently visible section, or null
 */

import { useState, useEffect, useRef } from 'react';

export function useScrollSpy(sectionIds, { topOffset = 80, heroThreshold = 100 } = {}) {
  const [activeId, setActiveId] = useState(null);
  // Map<id, ratio> — store latest intersection ratio per section
  const ratioMap = useRef(new Map());

  useEffect(() => {
    if (!sectionIds.length) return;

    // ── Pick the "most visible" section above the fold ──────────────────
    // Called on every intersection event; reads ratioMap snapshot.
    function pickActive() {
      // Edge case 1: Hero is still fully visible — deactivate all links
      if (window.scrollY < heroThreshold) {
        setActiveId(null);
        return;
      }

      // Edge case 2: Scrolled to bottom — activate last section
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (nearBottom) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      // Normal case: find the section element that is:
      // a) actually intersecting (ratio > 0) AND
      // b) closest to the top of the page
      let bestId   = null;
      let bestTop  = Infinity;

      for (const id of sectionIds) {
        if ((ratioMap.current.get(id) ?? 0) > 0) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          // prefer the element whose top is closest to (but not above) our offset line
          if (top < topOffset && top > -window.innerHeight * 0.6) {
            // section has scrolled past the navbar — it's "active"
            if (Math.abs(top) < Math.abs(bestTop)) {
              bestTop = top;
              bestId  = id;
            }
          } else if (bestId === null && top >= topOffset) {
            // nothing above offset yet — track the first section below
            if (top < bestTop) {
              bestTop = top;
              bestId  = id;
            }
          }
        }
      }

      // Fallback: if nothing in ratioMap matches, find section whose top
      // is most recently scrolled past (highest negative top value)
      if (!bestId) {
        let closestNegTop = -Infinity;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= topOffset && top > closestNegTop) {
            closestNegTop = top;
            bestId        = id;
          }
        }
      }

      setActiveId(bestId);
    }

    // ── IntersectionObserver setup ──────────────────────────────────────
    // rootMargin: top offset pushes detection zone below the fixed navbar.
    // Multiple thresholds give us fine-grained ratio data for pickActive().
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          ratioMap.current.set(entry.target.id, entry.intersectionRatio);
        });
        pickActive();
      },
      {
        root: null,
        // Shift the top boundary down by topOffset so sections register
        // as "entered" only after clearing the fixed navbar.
        rootMargin: `-${topOffset}px 0px -20% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    // Observe every section
    const elements = [];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    // Also re-run pickActive on scroll for the edge-case bottom detection
    const handleScroll = () => pickActive();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check
    pickActive();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, topOffset, heroThreshold]);

  return activeId;
}
