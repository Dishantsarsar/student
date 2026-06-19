import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (options.triggerOnce) {
          observer.unobserve(target);
        }
      } else {
        if (!options.triggerOnce) {
          setIsIntersecting(false);
        }
      }
    }, {
      threshold: options.threshold || 0,
      root: options.root || null,
      rootMargin: options.rootMargin || '0px'
    });

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [ref, options.threshold, options.root, options.rootMargin, options.triggerOnce]);

  return isIntersecting;
}
