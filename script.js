document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const header = document.querySelector(".site-header");

  // ===== DARK / LIGHT MODE =====
  function applyTheme(theme) {
    const dark = theme === "dark";

    document.body.classList.toggle("dark-mode", dark);

    if (themeIcon) {
      themeIcon.textContent = dark ? "☀" : "☾";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        dark ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  let savedTheme = "light";

  try {
    savedTheme = localStorage.getItem("education-page-theme") || "light";
  } catch (error) {
    savedTheme = "light";
  }

  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode")
        ? "light"
        : "dark";

      applyTheme(nextTheme);

      try {
        localStorage.setItem("education-page-theme", nextTheme);
      } catch (error) {
        // Theme switching still works if storage is unavailable.
      }
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  function updateHeaderOnScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
  }

  updateHeaderOnScroll();

  window.addEventListener("scroll", updateHeaderOnScroll, {
    passive: true
  });

  // ===== FOOTER YEAR =====
  const year = document.getElementById("currentYear");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ===== SOCIAL LINKS =====
  const socialLinks = {
    instagram: "https://www.instagram.com/amitrana_2026/",
    youtube: "https://www.youtube.com/@crazy_meet"
  };

  const instagramLink = document.getElementById("instagramLink");
  const youtubeLink = document.getElementById("youtubeLink");

  if (instagramLink) {
    instagramLink.href = socialLinks.instagram;
  }

  if (youtubeLink) {
    youtubeLink.href = socialLinks.youtube;
  }
});


/* ===== LIVE WEBSITE COLOR TESTER ===== */

const colorTester = document.getElementById("colorTester");

if (colorTester) {
  const colorButtons = colorTester.querySelectorAll("[data-color]");
  const selectedColor = document.getElementById("selectedColor");
  const root = document.documentElement;

  // Save the original theme variables.
  const originalColors = {
    purple: getComputedStyle(root).getPropertyValue("--purple").trim(),
    purpleDark: getComputedStyle(root)
      .getPropertyValue("--purple-dark").trim(),
    purpleLight: getComputedStyle(root)
      .getPropertyValue("--purple-light").trim()
  };

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color;

      // Update the main website theme variables.
      root.style.setProperty("--purple", color);
      root.style.setProperty("--purple-dark", color);
      root.style.setProperty("--purple-light", color);

      root.style.setProperty("--primary", color);
      root.style.setProperty("--accent", color);
      root.style.setProperty("--theme-color", color);

      // Update the selected color label.
      if (selectedColor) {
        selectedColor.textContent = color;
      }

      // Update the selected button.
      colorButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  // Do not automatically change the website theme on startup.
}


/* ===== MOBILE UPI PAYMENT BUTTONS ===== */

document.addEventListener("DOMContentLoaded", () => {
  const upiId = "plussoonee@oksbi";
  const payeeName = "R. AMIT";
  const paymentNote = "Support my education";

  const paymentButtons = document.querySelectorAll("[data-upi-app]");

  paymentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const app = button.dataset.upiApp;

      const appDetails = {
        gpay: {
          androidPackage: "com.google.android.apps.nbu.paisa.user",
          iosScheme: "gpay://upi/pay?"
        },
        phonepe: {
          androidPackage: "com.phonepe.app",
          iosScheme: "phonepe://pay?"
        },
        paytm: {
          androidPackage: "net.one97.paytm",
          iosScheme: "paytmmp://pay?"
        }
      };

      const selectedApp = appDetails[app];

      if (!selectedApp) {
        return;
      }

      // Amount is deliberately omitted.
      // The payer enters the amount inside the payment app.
      const params = new URLSearchParams({
        pa: upiId,
        pn: payeeName,
        tn: paymentNote,
        cu: "INR"
      });

      const query = params.toString();

      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isAndroid) {
        // Request Android/Chrome to open the selected UPI app.
        window.location.href =
          `intent://pay?${query}` +
          `#Intent;scheme=upi;package=${selectedApp.androidPackage};end`;
      } else if (isIOS) {
        // App-specific links may behave differently across devices.
        window.location.href = selectedApp.iosScheme + query;
      } else {
        // Desktop fallback.
        window.location.href = `upi://pay?${query}`;
      }
    });
  });
});