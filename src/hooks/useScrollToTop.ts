import { useEffect } from 'react';

export function useScrollToTop() {
  useEffect(() => {
    // Scroll para o topo da página
    window.scrollTo(0, 0);

    // Também scroll para o topo de containers com scroll interno
    const scrollContainers = document.querySelectorAll('[data-scroll-container]');
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, []);
}
