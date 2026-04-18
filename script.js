/* =========================================================
   GREENAYU WEBSITE - PRODUCTION SCRIPT
   ---------------------------------------------------------
   Features:
   1. Mobile navigation toggle + accessibility support
   2. Auto-close mobile menu on link click / resize / Escape
   3. Scroll reveal animation
   4. Intro loader animation
   5. Active navigation highlighting on scroll
   6. EmailJS contact form handling
   ========================================================= */

// =============================
// DOM ELEMENTS
// =============================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("section[id]");
const introLoader = document.getElementById("introLoader");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// =============================
// MOBILE MENU
// =============================
function isMobileViewport() {
  return window.innerWidth <= 992;
}

function toggleMobileMenu() {
  if (!menuToggle || !navMenu) return;

  navMenu.classList.toggle("show");
  const isExpanded = navMenu.classList.contains("show");
  menuToggle.setAttribute("aria-expanded", String(isExpanded));
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

// =============================
// SCROLL REVEAL ANIMATION
// =============================
function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      element.classList.add("show");
    }
  });
}

// =============================
// ACTIVE NAV LINK ON SCROLL
// =============================
function updateActiveNavLink() {
  let currentSectionId = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href");
    link.classList.toggle("active", targetId === `#${currentSectionId}`);
  });
}

function handleScroll() {
  revealOnScroll();
  updateActiveNavLink();
}

window.addEventListener("scroll", handleScroll, { passive: true });

// =============================
// INTRO LOADER ANIMATION
// =============================
window.addEventListener("load", () => {
  document.body.classList.add("loading");

  if (introLoader) {
    setTimeout(() => {
      introLoader.classList.add("open");
    }, 1600);

    setTimeout(() => {
      introLoader.classList.add("hide");
      document.body.classList.remove("loading");
      document.body.classList.add("loaded");
    }, 3000);
  } else {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }

  handleScroll();

  // Initialize Lucide icons safely
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
});

// =============================
// EMAILJS SETUP
// =============================
if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: "nmWUaQ9f36QEOvFM2",
    blockHeadless: true,
    limitRate: {
      id: "contact-form",
      throttle: 10000,
    },
  });
}

// =============================
// CONTACT FORM SUBMISSION
// =============================
if (contactForm && formStatus && typeof emailjs !== "undefined") {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status sending";

    try {
      await emailjs.sendForm(
        "service_a5uxvsc",
        "template_k2ydvce",
        "#contact-form"
      );

      formStatus.textContent = "Message sent successfully!";
      formStatus.className = "form-status success";
      contactForm.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      formStatus.textContent = "Failed to send message. Please try again.";
      formStatus.className = "form-status error";
    }
  });
} else if (contactForm && formStatus) {
  formStatus.textContent = "Email service is not available right now.";
  formStatus.className = "form-status error";
}