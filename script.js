/* =========================================================
   GREENAYU WEBSITE — PRODUCTION SCRIPT
   ---------------------------------------------------------
   1. Mobile navigation toggle + accessibility
   2. Auto-close menu on link click / resize / Escape
   3. Staggered scroll-reveal animation
   4. Intro loader animation
   5. Active navigation highlighting on scroll
   6. Header scroll elevation effect
   7. EmailJS contact form handling
   ========================================================= */

// ========================
// DOM ELEMENTS
// ========================
const menuToggle    = document.getElementById("menuToggle");
const navMenu       = document.getElementById("navMenu");
const navLinks      = document.querySelectorAll(".nav-link");
const revealEls     = document.querySelectorAll(".reveal");
const sections      = document.querySelectorAll("section[id]");
const introLoader   = document.getElementById("introLoader");
const contactForm   = document.getElementById("contact-form");
const formStatus    = document.getElementById("form-status");
const header        = document.querySelector(".header");

// ========================
// MOBILE MENU
// ========================
function isMobileViewport() {
  return window.innerWidth <= 992;
}

function toggleMobileMenu() {
  if (!menuToggle || !navMenu) return;
  const isOpen = navMenu.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  if (!menuToggle || !navMenu) return;
  navMenu.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle) {
  menuToggle.addEventListener("click", toggleMobileMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMobileViewport()) closeMobileMenu();
  });
});

window.addEventListener("resize", () => {
  if (!isMobileViewport()) closeMobileMenu();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    navMenu &&
    navMenu.classList.contains("show") &&
    !navMenu.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

// ========================
// SCROLL REVEAL — STAGGERED
// ========================
function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.89;

  // Group siblings to stagger reveals within the same parent
  const pendingByParent = new Map();

  revealEls.forEach((el) => {
    if (el.classList.contains("show")) return; // already visible

    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      const parent = el.parentElement;
      if (!pendingByParent.has(parent)) pendingByParent.set(parent, []);
      pendingByParent.get(parent).push(el);
    }
  });

  // Apply staggered delay within each parent group
  pendingByParent.forEach((group) => {
    group.forEach((el, i) => {
      const delay = i * 80; // 80ms stagger between siblings
      setTimeout(() => el.classList.add("show"), delay);
    });
  });
}

// ========================
// ACTIVE NAV ON SCROLL
// ========================
function updateActiveNavLink() {
  let currentId = "";

  sections.forEach((section) => {
    const top    = section.offsetTop - 120;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${currentId}`);
  });
}

// ========================
// HEADER ELEVATION ON SCROLL
// ========================
function updateHeaderElevation() {
  if (!header) return;
  if (window.scrollY > 10) {
    header.style.boxShadow = "0 4px 24px rgba(8, 78, 72, 0.10)";
  } else {
    header.style.boxShadow = "0 2px 16px rgba(8, 78, 72, 0.06)";
  }
}

// ========================
// COMBINED SCROLL HANDLER
// ========================
function handleScroll() {
  revealOnScroll();
  updateActiveNavLink();
  updateHeaderElevation();
}

window.addEventListener("scroll", handleScroll, { passive: true });

// ========================
// INTRO LOADER ANIMATION
// ========================
window.addEventListener("load", () => {
  document.body.classList.add("loading");

  if (introLoader) {
    // Step 1: open panels after brief hold
    setTimeout(() => {
      introLoader.classList.add("open");
    }, 1700);

    // Step 2: fade out loader, reveal page
    setTimeout(() => {
      introLoader.classList.add("hide");
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");
    }, 3100);
  } else {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }

  // Run initial reveal pass
  setTimeout(handleScroll, 100);

  // Init Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
});

// ========================
// EMAILJS INITIALISATION
// ========================
if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: "nmWUaQ9f36QEOvFM2",
    blockHeadless: true,
    limitRate: {
      id:       "contact-form",
      throttle: 10000,
    },
  });
}

// ========================
// CONTACT FORM SUBMISSION
// ========================
if (contactForm && formStatus && typeof emailjs !== "undefined") {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector(".contact-btn");

    // Visual feedback: loading state
    formStatus.textContent = "Sending your message…";
    formStatus.className   = "form-status sending";
    if (btn) { btn.disabled = true; btn.style.opacity = "0.7"; }

    try {
      await emailjs.sendForm("service_a5uxvsc", "template_k2ydvce", "#contact-form");

      formStatus.textContent = "✓ Message sent successfully!";
      formStatus.className   = "form-status success";
      contactForm.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      formStatus.textContent = "Failed to send — please try again.";
      formStatus.className   = "form-status error";
    } finally {
      if (btn) { btn.disabled = false; btn.style.opacity = ""; }
    }
  });
} else if (contactForm && formStatus) {
  // EmailJS not loaded — show fallback notice
  formStatus.textContent = "Email service is currently unavailable.";
  formStatus.className   = "form-status error";
}
