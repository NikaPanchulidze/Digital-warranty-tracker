import { useEffect, useRef, useState } from 'react';

type UseInViewOnceOptions = {
  rootMargin?: string;
  threshold?: number;
};

export function useInViewOnce({ rootMargin = '0px 0px -15% 0px', threshold = 0.2 }: UseInViewOnceOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    if (hasEnteredView) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    const element = ref.current;
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [hasEnteredView, rootMargin, threshold]);

  return { ref, hasEnteredView };
}
