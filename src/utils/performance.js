export function debounce(fn, wait = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function throttle(fn, limit = 100) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function lazyLoadImages(rootSelector = '[data-src]') {
  if (!('IntersectionObserver' in window)) {
   
    document.querySelectorAll(rootSelector).forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll(rootSelector).forEach(img => obs.observe(img));
}

export function preloadResource(href, as = 'fetch', type = '') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

export function measurePerf(name) {
  if (!('performance' in window)) return;
  performance.mark(name);
  if (process.env.NODE_ENV === 'development') {
    const entries = performance.getEntriesByName(name);
    if (entries.length) {
      console.debug(`[perf] ${name}: ${entries[0].startTime.toFixed(1)}ms`);
    }
  }
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
