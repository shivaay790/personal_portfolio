import { useEffect, useRef } from 'react';
import { devLog } from '@/lib/logger';

// Adds fade-in on scroll down and fade-out on scroll up for elements with [data-reveal]
export function useScrollReveal() {
  const lastScrollYRef = useRef<number>(0);
  const scrollingUpRef = useRef<boolean>(false);

  useEffect(() => {
    const handleScrollDirection = () => {
      const currentY = window.scrollY;
      scrollingUpRef.current = currentY < lastScrollYRef.current;
      lastScrollYRef.current = currentY;
      devLog('scroll', { currentY, scrollingUp: scrollingUpRef.current });
    };

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    // Initialize base class
    elements.forEach((el) => {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          
          // Calculate how much of the element is visible
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const elementHeight = rect.height;
          const visibilityRatio = visibleHeight / elementHeight;

          if (entry.isIntersecting && visibilityRatio > 0.3) {
            // Element is significantly in viewport - show content
            devLog('reveal', 'in', el.id || el.tagName, `${Math.round(visibilityRatio * 100)}% visible`);
            el.classList.add('reveal-in');
            el.classList.remove('reveal-out');
            
            // Add a slight delay for smoother transitions
            el.style.transitionDelay = '0.1s';
          } else {
            // Element is not sufficiently visible - hide content
            devLog('reveal', 'out', el.id || el.tagName, `${Math.round(visibilityRatio * 100)}% visible`);
            el.classList.remove('reveal-in');
            el.classList.add('reveal-out');
            
            // No delay when hiding
            el.style.transitionDelay = '0s';
          }
        });
      },
      { 
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], // Multiple thresholds for precise detection
        rootMargin: '-10% 0px -10% 0px' // Some margin but not too restrictive
      }
    );

    elements.forEach((el) => observer.observe(el));
    window.addEventListener('scroll', handleScrollDirection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollDirection);
    };
  }, []);
}


