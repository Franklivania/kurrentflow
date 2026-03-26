
// ─── Scroll reveal ───
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => observer.observe(el));

// ─── Nav scroll state ───
const nav = document.getElementById("nav");
let lastScroll = 0;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    lastScroll = y;
  },
  { passive: true },
);

// ─── Mobile menu toggle ───
const mobileToggle = document.querySelector(".nav-mobile-toggle");
function setScrollLock(lock) {
  document.body.style.overflow = lock ? "hidden" : "";
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
function closeMobileMenu() {
  nav.classList.remove("open");
  setScrollLock(false);
}
mobileToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  setScrollLock(isOpen);
});
document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", closeMobileMenu);
});
nav.addEventListener("click", (e) => {
  if (e.target === nav && nav.classList.contains("open")) closeMobileMenu();
});

// ─── Smooth scroll for anchor links ───
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
// ─── Hero Slideshow ───
(function () {
  const slides = document.querySelectorAll(".hero-slide");
  const pips = document.querySelectorAll(".hero-pip");
  const counter = document.getElementById("slideNum");
  const heading = document.getElementById("heroHeading");
  const body = document.getElementById("heroBody");

  const INTERVAL = 6000; // 6s per slide
  const TRANSITION_DURATION = 600; // text transition ms
  let current = 0;
  let timer = null;
  let isPaused = false;

  // Slide-specific content
  const slideContent = [
    {
      heading: ["Reliable Supply for Every", "Stage of Construction"],
      body: "From plumbing systems to finishing fixtures, Kurrent Flow delivers trusted building materials, sanitary solutions, and tools \u2014 sourced and supplied without compromise.",
    },
    {
      heading: ["Premium Sanitary Ware", "Built for Durability"],
      body: "Toilets, basins, sink units, and bathroom fixtures \u2014 sourced from verified manufacturers and supplied to meet the standards your projects demand.",
    },
    {
      heading: ["Complete Plumbing", "Solutions Delivered"],
      body: "Pipes, fittings, valves, and water flow systems for residential and commercial installations. Everything you need, from foundation to final connection.",
    },
    {
      heading: ["From Groundwork", "to Grand Opening"],
      body: "We supply essential materials for every phase of construction \u2014 structural, mechanical, and finishing \u2014 so your project stays on schedule and on standard.",
    },
  ];

  function goToSlide(index) {
    if (index === current) return;
    const prev = current;
    current = index;

    // Transition images
    slides[prev].classList.remove("active");
    slides[current].classList.add("active");

    // Update pips
    pips.forEach((p, i) => {
      p.classList.remove("active", "done");
      if (i < current) p.classList.add("done");
      if (i === current) {
        // Force reflow to restart animation
        void p.offsetWidth;
        p.classList.add("active");
      }
    });

    // Update counter
    counter.textContent = String(current + 1).padStart(2, "0");

    // Transition text content
    const content = slideContent[current];

    // Fade out
    heading.classList.add("transitioning");
    body.classList.add("transitioning");
    body.classList.remove("transitioned");

    setTimeout(() => {
      // Swap content
      heading.innerHTML = content.heading
        .map((line) => '<span class="hero-text-line">' + line + "</span>")
        .join("");
      body.textContent = content.body;

      // Fade in
      heading.classList.remove("transitioning");
      body.classList.remove("transitioning");
      body.classList.add("transitioned");
    }, TRANSITION_DURATION);
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!isPaused) nextSlide();
    }, INTERVAL);
  }

  // Pip click handlers
  pips.forEach((pip) => {
    pip.addEventListener("click", () => {
      const idx = parseInt(pip.dataset.slide);
      goToSlide(idx);
      startTimer(); // Reset timer on manual interaction
    });
  });

  // Pause on hover (desktop)
  const hero = document.getElementById("hero");
  hero.addEventListener("mouseenter", () => {
    isPaused = true;
  });
  hero.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  // Pause when tab is not visible (save resources)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      startTimer();
    }
  });

  // Preload remaining slides after first paint
  window.addEventListener("load", () => {
    slides.forEach((slide, i) => {
      if (i === 0) return; // Already loaded with fetchpriority=high
      const img = slide.querySelector("img");
      if (img && img.loading === "lazy") {
        // Trigger load by removing lazy
        img.loading = "eager";
      }
    });
  });

  // Initialize first pip animation
  pips[0].classList.add("active");

  // Start
  startTimer();
})();