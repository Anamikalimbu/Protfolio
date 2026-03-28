/* ============================================================
   PORTFOLIO — script.js
   Features:
     1. Smooth nav + active section highlight
     2. Contact form validation & submit feedback
     3. Scroll animations (fade-in on scroll)
     4. Typing animation for hero bio
   ============================================================ */

/* ─────────────────────────────────────────────
   1. NAV — sticky header + active-link highlight
   ───────────────────────────────────────────── */

/**
 * Injects a minimal sticky nav bar at the top of the page.
 * Links light up as the matching section scrolls into view.
 */
(function initNav() {
  /* Build the nav element */
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="#home">Anamika Limbu</a>
      <ul class="nav-links">
        <li><a href="#home"     data-section="home">Home</a></li>
        <li><a href="#about"    data-section="about">About</a></li>
        <li><a href="#projects" data-section="projects">Projects</a></li>
        <li><a href="#contact"  data-section="contact">Contact</a></li>
      </ul>
      <button class="nav-burger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
  document.body.prepend(nav);

  /* Inject nav styles */
  const style = document.createElement("style");
  style.textContent = `
    .site-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 999;
      padding: 0 2rem;
      background: transparent;
      transition: background .35s, box-shadow .35s, backdrop-filter .35s;
    }
    .site-nav.scrolled {
      background: rgba(250,248,244,.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 2px 20px rgba(26,23,20,.08);
    }
    .nav-inner {
      max-width: 1140px;
      margin: 0 auto;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .nav-logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.35rem;
      font-weight: 900;
      color: #c9a96e;
      letter-spacing: .08em;
      text-decoration: none;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 2rem;
    }
    .nav-links a {
      font-family: 'DM Sans', sans-serif;
      font-size: .85rem;
      font-weight: 500;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #3d3733;
      text-decoration: none;
      position: relative;
      padding-bottom: 3px;
      transition: color .3s;
    }
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 0; height: 2px;
      background: #c9a96e;
      border-radius: 2px;
      transition: width .3s cubic-bezier(.4,0,.2,1);
    }
    .nav-links a.active,
    .nav-links a:hover { color: #c9a96e; }
    .nav-links a.active::after,
    .nav-links a:hover::after { width: 100%; }

    /* Burger (mobile) */
    .nav-burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }
    .nav-burger span {
      display: block;
      width: 24px; height: 2px;
      background: #1a1714;
      border-radius: 2px;
      transition: transform .3s, opacity .3s;
    }
    .nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-burger.open span:nth-child(2) { opacity: 0; }
    .nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    @media (max-width: 640px) {
      .nav-burger { display: flex; }
      .nav-links {
        position: fixed;
        inset: 64px 0 0 0;
        background: rgba(250,248,244,.97);
        backdrop-filter: blur(16px);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2.5rem;
        transform: translateX(100%);
        transition: transform .35s cubic-bezier(.4,0,.2,1);
      }
      .nav-links.open { transform: translateX(0); }
      .nav-links a { font-size: 1.1rem; }
    }
  `;
  document.head.appendChild(style);

  /* Scroll → add .scrolled class */
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  /* Active section highlight via IntersectionObserver */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = nav.querySelectorAll(".nav-links a[data-section]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.dataset.section === entry.target.id)
          );
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((s) => observer.observe(s));

  /* Burger toggle */
  const burger = nav.querySelector(".nav-burger");
  const linkList = nav.querySelector(".nav-links");
  burger.addEventListener("click", () => {
    const open = burger.classList.toggle("open");
    linkList.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  /* Close mobile menu on link click */
  linkList.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      linkList.classList.remove("open");
      burger.setAttribute("aria-expanded", false);
    })
  );
})();


/* ─────────────────────────────────────────────
   2. CONTACT FORM — validation & feedback
   ───────────────────────────────────────────── */
(function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  /* Helper: show inline error beneath a field */
  function setError(input, msg) {
    let err = input.parentElement.querySelector(".field-error");
    if (!err) {
      err = document.createElement("span");
      err.className = "field-error";
      err.style.cssText =
        "display:block;font-size:.75rem;color:#f87171;margin-top:.25rem;";
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
    input.style.borderColor = "#f87171";
  }

  function clearError(input) {
    const err = input.parentElement.querySelector(".field-error");
    if (err) err.textContent = "";
    input.style.borderColor = "";
  }

  /* Live validation on blur */
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => clearError(field));
  });

  function validateField(field) {
    const v = field.value.trim();
    if (!v) {
      setError(field, "This field is required.");
      return false;
    }
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setError(field, "Please enter a valid email address.");
      return false;
    }
    clearError(field);
    return true;
  }

  /* Submit handler */
  const btn = form.querySelector(".btn-submit");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll("input, textarea")];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) return;

    /* Simulate sending (replace with real fetch/EmailJS call) */
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending…`;

    setTimeout(() => {
      /* Success state */
      form.innerHTML = `
        <div class="form-success">
          <i class="fa-solid fa-circle-check"></i>
          <h3>Message sent!</h3>
          <p>Thanks for reaching out — I'll get back to you within 24 hours.</p>
        </div>
      `;
      /* Inject success styles once */
      if (!document.getElementById("form-success-style")) {
        const s = document.createElement("style");
        s.id = "form-success-style";
        s.textContent = `
          .form-success {
            display: flex; flex-direction: column;
            align-items: flex-start; gap: .75rem;
            padding: 2rem 0; animation: fadeUp .6s ease both;
          }
          .form-success i {
            font-size: 2.5rem; color: #86efac;
          }
          .form-success h3 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.6rem; color: #faf8f4;
          }
          .form-success p {
            color: rgba(250,248,244,.65); font-size: .95rem; line-height: 1.7;
          }
        `;
        document.head.appendChild(s);
      }
    }, 1600);
  });
})();


/* ─────────────────────────────────────────────
   3. SCROLL ANIMATIONS — fade-in on scroll
   ───────────────────────────────────────────── */
(function initScrollAnimations() {
  /* Inject base styles */
  const style = document.createElement("style");
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(36px);
      transition: opacity .65s cubic-bezier(.4,0,.2,1),
                  transform .65s cubic-bezier(.4,0,.2,1);
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    /* Stagger children inside a container */
    .reveal-stagger > * {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .55s cubic-bezier(.4,0,.2,1),
                  transform .55s cubic-bezier(.4,0,.2,1);
    }
    .reveal-stagger.visible > *:nth-child(1) { transition-delay: .05s; opacity:1; transform:none; }
    .reveal-stagger.visible > *:nth-child(2) { transition-delay: .12s; opacity:1; transform:none; }
    .reveal-stagger.visible > *:nth-child(3) { transition-delay: .19s; opacity:1; transform:none; }
    .reveal-stagger.visible > *:nth-child(4) { transition-delay: .26s; opacity:1; transform:none; }
    .reveal-stagger.visible > *:nth-child(5) { transition-delay: .33s; opacity:1; transform:none; }
    .reveal-stagger.visible > *:nth-child(6) { transition-delay: .40s; opacity:1; transform:none; }
    .reveal-stagger.visible > *:nth-child(n+7) { transition-delay: .46s; opacity:1; transform:none; }
  `;
  document.head.appendChild(style);

  /* Tag elements to animate */
  const targets = [
    ".section-label",
    ".section-title",
    ".about-text p",
    ".about-stats",
    ".project-card",
    ".contact-info",
    ".contact-form",
    ".social-link",
  ];
  targets.forEach((sel) =>
    document.querySelectorAll(sel).forEach((el) => el.classList.add("reveal"))
  );

  /* Stagger skill cards and social links as groups */
  document.querySelector(".skills-grid")?.classList.add("reveal-stagger");
  document.querySelector(".projects-grid")?.classList.add("reveal-stagger");
  document.querySelector(".social-row")?.classList.add("reveal-stagger");

  /* Observer */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".reveal, .reveal-stagger")
    .forEach((el) => io.observe(el));
})();


/* ─────────────────────────────────────────────
   4. TYPING ANIMATION — hero bio cycling text
   ───────────────────────────────────────────── */
(function initTyping() {
  const bio = document.querySelector(".hero-bio");
  if (!bio) return;

  const lines = [
    "Full-Stack Developer & UI Designer",
    "Building beautiful, purposeful products",
    "Turning ideas into living interfaces",
    "Always learning. Always shipping. ✦",
  ];

  /* Wrap the animated part in a span */
  bio.innerHTML = `<span class="typed-line"></span><br>Let's build something amazing together!`;

  const typedEl = bio.querySelector(".typed-line");

  /* Add cursor style */
  const s = document.createElement("style");
  s.textContent = `
    .typed-line::after {
      content: '|';
      margin-left: 2px;
      color: #c9a96e;
      animation: blink .7s step-end infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  `;
  document.head.appendChild(s);

  let lineIdx = 0;
  let charIdx = 0;
  let deleting = false;

  const TYPING_SPEED  = 55;   // ms per character while typing
  const ERASE_SPEED   = 28;   // ms per character while erasing
  const PAUSE_AFTER   = 2000; // ms to hold full text before erasing
  const PAUSE_BEFORE  = 400;  // ms pause before typing next line

  function tick() {
    const current = lines[lineIdx];

    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, ERASE_SPEED);
    }
  }

  /* Slight delay so page paints first */
  setTimeout(tick, 1200);
})();
