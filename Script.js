/* =============================================
   DHIMAN TARAFDAR — PORTFOLIO JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initActiveNavLinks();
  initContactForm();
  setFooterYear();
  initTypingEffect();
  initCursorGlow();
  initSkillTagHover();
  initSmoothScroll();
});

// ─── NAVBAR SCROLL ───────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ─── HAMBURGER MENU ──────────────────────────
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// ─── SCROLL REVEAL ───────────────────────────
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.children];
      const index    = siblings.indexOf(entry.target);
      const delay    = Math.min(index * 80, 400);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ─── ACTIVE NAV LINK ON SCROLL ───────────────
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { threshold: 0.35, rootMargin: '-72px 0px 0px 0px' });

  sections.forEach(s => observer.observe(s));
}

// ─── CONTACT FORM ────────────────────────────
// Submits to Formspree via fetch() so the page never
// reloads, but the message actually reaches your inbox.
function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg   = document.getElementById('formError');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) return;

    // Loading state
    submitBtn.disabled  = true;
    submitBtn.innerHTML = '<span>Sending\u2026</span> <i class="fas fa-spinner fa-spin"></i>';
    if (errorMsg) errorMsg.classList.remove('show');

    try {
      const response = await fetch(form.action, {
        method  : 'POST',
        headers : { 'Accept': 'application/json' },
        body    : new FormData(form)
      });

      if (response.ok) {
        // SUCCESS — message delivered to your Gmail
        submitBtn.innerHTML        = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        submitBtn.style.background = 'rgba(74,222,128,0.9)';
        successMsg.classList.add('show');
        form.reset();

        setTimeout(() => {
          submitBtn.disabled         = false;
          submitBtn.innerHTML        = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
          submitBtn.style.background = '';
          successMsg.classList.remove('show');
        }, 4000);

      } else {
        // Formspree returned an error
        throw new Error('Formspree error');
      }

    } catch (err) {
      // Network or Formspree error
      submitBtn.disabled         = false;
      submitBtn.innerHTML        = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      submitBtn.style.background = '';
      if (errorMsg) errorMsg.classList.add('show');
    }
  });
}

// ─── FOOTER YEAR ─────────────────────────────
function setFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

// ─── TYPING EFFECT — truly zero flicker ──────
// Root cause of flicker: setting textContent = '' for
// even 1ms causes a blank-frame flash the browser paints.
// Fix: NEVER set empty text. Instead fade opacity to 0,
// swap the text while invisible, then fade back to 1.
// The element always has content → zero blank frames.
function initTypingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  // Fixed dimensions — element never resizes, no layout shift
  tagline.style.display        = 'inline-block';
  tagline.style.minHeight      = '1.6em';
  tagline.style.minWidth       = '1px';
  tagline.style.whiteSpace     = 'nowrap';
  tagline.style.overflow       = 'hidden';
  tagline.style.verticalAlign  = 'middle';
  // Smooth opacity transition for phrase swap
  tagline.style.transition     = 'opacity 0.18s ease';

  const phrases = [
    'MERN Stack Developer \u00b7 ML Engineer',
    'PyTorch \u00b7 Deep Learning \u00b7 Research',
    'Building Intelligent Web Applications',
    'CGPA 3.75 \u00b7 HSTU, Bangladesh'
  ];

  let phraseIdx  = 0;
  let charIdx    = phrases[0].length; // start fully typed
  let isDeleting = false;
  let timerId    = null;

  // Show first phrase immediately (no typing-in on load)
  tagline.textContent = phrases[0];

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      charIdx++;
      tagline.textContent = phrase.slice(0, charIdx);

      if (charIdx === phrase.length) {
        // Fully typed — hold, then delete
        timerId = setTimeout(() => {
          isDeleting = true;
          timerId = setTimeout(tick, 80);
        }, 2400);
        return;
      }
      timerId = setTimeout(tick, 70);

    } else {
      // Deleting — stop at 1 char, never go to 0
      if (charIdx > 1) {
        charIdx--;
        tagline.textContent = phrase.slice(0, charIdx);
        timerId = setTimeout(tick, 40);
      } else {
        // 1 char left — fade out, swap phrase, fade in
        // This replaces the blank-frame moment entirely
        tagline.style.opacity = '0';
        timerId = setTimeout(() => {
          phraseIdx  = (phraseIdx + 1) % phrases.length;
          charIdx    = 1;
          isDeleting = false;
          tagline.textContent = phrases[phraseIdx].slice(0, 1);
          tagline.style.opacity = '1';
          // Small pause before typing the new phrase
          timerId = setTimeout(tick, 200);
        }, 200); // matches the CSS transition duration
      }
    }
  }

  // Begin the cycle after a comfortable delay
  timerId = setTimeout(() => {
    isDeleting = true;
    timerId = setTimeout(tick, 80);
  }, 3000);
}

// ─── CURSOR GLOW — GPU-composited ─────────────
// Uses transform (not left/top) → compositor thread only,
// never triggers layout → no flicker contribution.
function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.setAttribute('aria-hidden', 'true');
  Object.assign(glow.style, {
    position      : 'fixed',
    width         : '340px',
    height        : '340px',
    borderRadius  : '50%',
    background    : 'radial-gradient(circle, rgba(200,169,110,0.048) 0%, transparent 70%)',
    pointerEvents : 'none',
    zIndex        : '0',
    top           : '0',
    left          : '0',
    willChange    : 'transform',
    // Start off-screen so it doesn't flash at (0,0) on load
    transform     : 'translate(-500px, -500px)',
  });
  document.body.appendChild(glow);

  let mx = -500, my = -500;
  let rafPending = false;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX - 170; // pre-subtract half width
    my = e.clientY - 170;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        glow.style.transform = `translate(${mx}px,${my}px)`;
        rafPending = false;
      });
    }
  }, { passive: true });
}

// ─── SKILL TAG HOVER ─────────────────────────
function initSkillTagHover() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => { tag.style.transform = 'translateY(-2px)'; });
    tag.addEventListener('mouseleave', () => { tag.style.transform = ''; });
  });
}

// ─── SMOOTH SCROLL ───────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}