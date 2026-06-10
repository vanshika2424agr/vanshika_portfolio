import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — attaches an IntersectionObserver to a DOM element.
 * When the element enters the viewport (threshold 15%), adds .visible class.
 * The CSS transitions then handle the animation (defined in global.css).
 *
 * @param {number} threshold - 0 to 1, how much of the element must be visible
 * @returns {React.RefObject} - attach this to your element's ref prop
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          // Unobserve after reveal — no re-triggering on scroll back
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);

    // Cleanup: disconnect observer when component unmounts
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * useMultiReveal — returns multiple refs for independent reveal timing.
 * Useful when a section has several subsections that should stagger.
 *
 * @param {number} count - number of refs to create
 * @param {number} threshold - viewport visibility threshold
 * @returns {Array<React.RefObject>}
 */
export function useMultiReveal(count, threshold = 0.1) {
  const refs = Array.from({ length: count }, () => useRef(null));

  useEffect(() => {
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Stagger: each subsequent element delays a bit more
            setTimeout(() => el.classList.add('visible'), i * 80);
            observer.unobserve(el);
          }
        },
        { threshold }
      );

      observer.observe(el);
    });

    return () => refs.forEach(r => r.current && r.current.classList.remove('visible'));
  }, []);

  return refs;
}
