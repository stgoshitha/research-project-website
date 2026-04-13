// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Close mobile menu when clicking a nav link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      el.classList.add("show");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Active navbar link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// =============================
// EmailJS Contact Form
// =============================
(function () {
  emailjs.init({
    publicKey: "nmWUaQ9f36QEOvFM2",
    blockHeadless: true,
    limitRate: {
      id: "contact-form",
      throttle: 10000,
    },
  });
})();

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    formStatus.textContent = "Sending message...";
    formStatus.className = "form-status sending";

    emailjs
      .sendForm("service_a5uxvsc", "template_k2ydvce", "#contact-form")
      .then(() => {
        formStatus.textContent = "Message sent successfully!";
        formStatus.className = "form-status success";
        contactForm.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        formStatus.textContent = "Failed to send message. Please try again.";
        formStatus.className = "form-status error";
      });
  });
}
