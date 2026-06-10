/* ============================================================
   useCountUp.js
   Animates a number from 0 to a target value when triggered.
   Used in Hero section stat cards.

   Usage:
     const { count, ref } = useCountUp(4, 1500);
     <div ref={ref}>{count}+</div>
   ============================================================ */

import { useState, useRef, useEffect } from 'react';

/**
 * useCountUp
 * @param {number} target - the final number to count to
 * @param {number} duration - animation duration in ms (default 1500)
 * @returns {{ count: number, ref: React.RefObject }}
 */
export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Use IntersectionObserver so counting only starts when element is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          startCount();
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function startCount() {
    const startTime = performance.now();

    // requestAnimationFrame loop for smooth 60fps counting
    function tick(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out curve: progress decelerates near the end
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  return { count, ref };
}
