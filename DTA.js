/* ================================================================
   DTA DIGITAL SERVICES — SHARED SITE INTERACTIONS
================================================================ */

(() => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  /* ---------------- Mobile navigation ---------------- */
  const closeMobileMenu = () => {
    if (!nav || !menuToggle) return;
    nav.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.textContent = "☰";
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = nav.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
  }

  /* ---------------- One shared Services dropdown ----------------
     The Services text always navigates to services.html.
     The arrow button opens/closes the submenu. This behavior is shared
     by every HTML page instead of having a special Blog implementation.
  ------------------------------------------------------------------- */
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = dropdown.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
        const toggle = dropdown.querySelector(".nav-dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });

    if (nav && menuToggle && nav.classList.contains("active") && !nav.contains(event.target) && event.target !== menuToggle) {
      closeMobileMenu();
    }
  });

  if (nav) {
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
        closeMobileMenu();
      });
    });
  }


  /* ---------------- Scroll position ---------------- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  window.addEventListener("pageshow", (event) => {
    if (!window.location.hash && event.persisted) window.scrollTo(0, 0);
  });
})();

/* ================================================================
   WEB3FORMS AJAX SUBMISSION (CONTACT PAGE)
================================================================ */
const contactForm = document.getElementById('dtaContactForm');
const formStatus = document.getElementById('dtaFormStatus');
const submitBtn = document.getElementById('dtaSubmitButton');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    formStatus.style.color = 'var(--purple)';
    formStatus.innerHTML = 'Please wait...';

    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
      .then(async (response) => {
        let res = await response.json();
        if (response.status === 200) {
          formStatus.style.color = '#10b981'; // Green success color
          formStatus.innerHTML = 'Thank you! Your message has been sent successfully.';
          contactForm.reset();
        } else {
          formStatus.style.color = '#ef4444'; // Red error color
          formStatus.innerHTML = res.message || 'Something went wrong. Please try again.';
        }
      })
      .catch((error) => {
        formStatus.style.color = '#ef4444';
        formStatus.innerHTML = 'Something went wrong. Please check your internet connection.';
      })
      .then(() => {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        setTimeout(() => {
          formStatus.innerHTML = '';
        }, 6000);
      });
  });
}

/* ================================================================
   DTA — MOBILE UX ENHANCEMENTS
   Lightweight native-scroll carousels + progressive text disclosure.
================================================================ */
(() => {
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const carouselSelectors = [
    '.home-page #services .services-grid',
    '.home-page #blog .blog-preview-grid',
    '.blog-page .blog-preview-grid',
    '.about-values-grid',
    '.video-content-grid'
  ];

  const readMoreSelectors = [
    '.home-hero p',
    '.section-heading p',
    '.dta-home-about-text p',
    '.page-hero-content p',
    '.about-page-content p',
    '.cw-features-header p',
    '.cw-card p',
    '.about-story-section p',
    '.related-content-header p',
    '.video-content-body p',
    '.dta-contact-hero p',
    '.dta-contact-intro > p',
    '.dta-strip-col p',
    '.home-contact-header p',
    '.home-step-item p'
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const carousels = new Set();
  let resizeTimer;

  const animateScroll = (el, target, duration = 300) => {
    if (prefersReducedMotion) {
      el.scrollLeft = target;
      return;
    }
    const start = el.scrollLeft;
    const distance = target - start;
    const startTime = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);

    const frame = now => {
      const progress = Math.min(1, (now - startTime) / duration);
      el.scrollLeft = start + distance * ease(progress);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const updateArrowState = (track, prev, next) => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth - 2);
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  const getStep = track => {
    const item = track.children[0];
    if (!item) return track.clientWidth;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    return item.getBoundingClientRect().width + gap;
  };

  const createCarousel = track => {
    if (!track || track.dataset.mobileCarouselReady === 'true') return;
    track.dataset.mobileCarouselReady = 'true';
    track.classList.add('mobile-carousel-track');

    const host = track.parentElement;
    if (!host) return;
    host.classList.add('mobile-carousel-host');

    const controls = document.createElement('div');
    controls.className = 'mobile-carousel-controls';
    controls.innerHTML = `
      <button class="mobile-carousel-arrow mobile-carousel-prev" type="button" aria-label="Previous item"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7"/></svg></button>
      <button class="mobile-carousel-arrow mobile-carousel-next" type="button" aria-label="Next item"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 5 7 7-7 7"/></svg></button>
    `;
    host.appendChild(controls);

    const prev = controls.querySelector('.mobile-carousel-prev');
    const next = controls.querySelector('.mobile-carousel-next');

    const move = direction => {
      const step = getStep(track);
      const target = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, track.scrollLeft + step * direction));
      animateScroll(track, target, 300);
      pauseAutoplay();
    };

    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));

    const refresh = () => updateArrowState(track, prev, next);
    track.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh, { passive: true });
    refresh();

    let autoplayId = null;
    let resumeId = null;

    const stopAutoplay = () => {
      if (autoplayId) clearInterval(autoplayId);
      autoplayId = null;
    };

    const pauseAutoplay = () => {
      stopAutoplay();
      if (resumeId) clearTimeout(resumeId);
      resumeId = setTimeout(startAutoplay, 4500);
    };

    const startAutoplay = () => {
      if (!mobileQuery.matches || prefersReducedMotion || autoplayId) return;
      autoplayId = setInterval(() => {
        const max = Math.max(0, track.scrollWidth - track.clientWidth - 2);
        if (track.scrollLeft >= max) {
          animateScroll(track, 0, 300);
        } else {
          const step = getStep(track);
          animateScroll(track, Math.min(max, track.scrollLeft + step), 300);
        }
      }, 3000);
    };

    track.addEventListener('pointerdown', pauseAutoplay, { passive: true });
    track.addEventListener('touchstart', pauseAutoplay, { passive: true });
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);

    carousels.add({ track, startAutoplay, stopAutoplay });
    startAutoplay();
  };

  const initCarousels = () => {
    document.querySelectorAll(carouselSelectors.join(',')).forEach(createCarousel);
  };

  const addReadMore = paragraph => {
  if (!paragraph || paragraph.dataset.readMoreReady === 'true') return;

  const text = paragraph.textContent.trim();
  if (text.length < 125) return;

  paragraph.dataset.readMoreReady = 'true';
  paragraph.classList.add('mobile-read-more-target');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mobile-read-more';
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Read More';

  button.addEventListener('click', () => {
    const expanded = paragraph.classList.toggle('mobile-expanded');

    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Read Less' : 'Read More';
  });

  paragraph.insertAdjacentElement('afterend', button);
};

const initReadMore = () => {
  document.querySelectorAll(readMoreSelectors.join(',')).forEach(addReadMore);
};

const addHomeServiceDescription = () => {
  const grid = document.querySelector('.home-page #services .services-grid');

  if (
    !grid ||
    grid.nextElementSibling?.classList.contains('mobile-carousel-description')
  ) {
    return;
  }

  const p = document.createElement('p');

  p.className = 'mobile-carousel-description';

  p.textContent =
    'With our service you can make your brand more engaging and active through focused content, social media, websites, search visibility and practical digital support.';

  grid.insertAdjacentElement('afterend', p);
};

const applyMobile = () => {
  if (!mobileQuery.matches) return;

  initCarousels();
  initReadMore();
  addHomeServiceDescription();
};

applyMobile();

mobileQuery.addEventListener('change', () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(applyMobile, 100);
});

})();