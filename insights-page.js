/* DTA Insights: lightweight reveal motion; video cards open external Instagram links. */
(() => {
  const sections = document.querySelectorAll('.iv-info-panel, .iv-video-card, .iv-agency-panel, .iv-cta-inner');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  sections.forEach((el) => { el.classList.add('iv-reveal'); });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('iv-in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  sections.forEach((el) => observer.observe(el));
})();
