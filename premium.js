/* DTA shared interactions: navigation, reveal effects and counters. */
(() => {
  const menu = document.querySelector(".premium-menu-toggle");
  const nav = document.querySelector(".premium-links");
  const dropdown = document.querySelector(".premium-dropdown");
  const dropdownButton = document.querySelector(".premium-drop-toggle");
  const year = document.querySelector("[data-year]");

  if (year) year.textContent = new Date().getFullYear();

  menu?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open") ?? false;
    menu.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menu.textContent = isOpen ? "×" : "☰";
  });

  dropdownButton?.addEventListener("click", () => {
    const isOpen = dropdown?.classList.toggle("open") ?? false;
    dropdownButton.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      dropdownButton?.setAttribute("aria-expanded", "false");
    }

    if (nav && menu && !nav.contains(event.target) && !menu.contains(event.target)) {
      nav.classList.remove("is-open");
      menu.setAttribute("aria-expanded", "false");
      menu.textContent = "☰";
    }
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll(".count-up");
  if (!("IntersectionObserver" in window)) {
    counters.forEach((item) => {
      item.textContent = Number(item.dataset.count || 0).toFixed(Number(item.dataset.decimals || 0));
    });
    return;
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      observer.unobserve(item);
      const target = Number(item.dataset.count || 0);
      const decimals = Number(item.dataset.decimals || 0);

      if (reduceMotion) {
        item.textContent = target.toFixed(decimals);
        return;
      }

      const start = performance.now();
      const duration = 1500;
      const animate = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        item.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }, { threshold: 0.4 });

  counters.forEach((item) => counterObserver.observe(item));
})();
