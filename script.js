/* ============================================================
   Kitchen Da Avenue — JavaScript
   ============================================================ */

/* ── NAVBAR SCROLL ────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

// Throttle scroll via requestAnimationFrame — prevents jank on fixed elements
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        backToTop.classList.add('visible');
      } else {
        navbar.classList.remove('scrolled');
        backToTop.classList.remove('visible');
      }
      highlightActiveNav();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── MOBILE HAMBURGER ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'translateY(8px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

/* ── ACTIVE NAV LINK ──────────────────────────────────────── */
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      links.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

/* ── TESTIMONIALS SLIDER ──────────────────────────────────── */
const cards    = document.querySelectorAll('.testimonial-card');
const dotsWrap = document.getElementById('sliderDots');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
let current = 0;
let autoTimer;

// Build dots
cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(index) {
  cards[current].classList.remove('active');
  dotsWrap.children[current].classList.remove('active');
  current = (index + cards.length) % cards.length;
  cards[current].classList.add('active');
  dotsWrap.children[current].classList.add('active');
}

function nextSlide() { goToSlide(current + 1); }
function prevSlide() { goToSlide(current - 1); }

nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

function startAutoSlide() {
  autoTimer = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
  clearInterval(autoTimer);
  startAutoSlide();
}

startAutoSlide();

/* ── SCROLL REVEAL ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .about-grid, .contact-grid, .gallery-item, .testimonials-slider, .stat-item, .menu-item, .section-header'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    if (el.dataset.delay) {
      el.style.transitionDelay = el.dataset.delay + 'ms';
    }
    revealObserver.observe(el);
  });
}

initReveal();

/* ── STATS COUNTER ANIMATION ──────────────────────────────── */
const statsSection = document.querySelector('.stats-section');
let counted = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let count = 0;
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(count);
      }, 16);
    });
  }
}, { threshold: 0.4 });

if (statsSection) statsObserver.observe(statsSection);

/* ── CONTACT FORM → EMAIL CLIENT ──────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const event   = document.getElementById('event').value;
    const guests  = document.getElementById('guests').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !event || !message) {
      showFormFeedback('Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const subject = encodeURIComponent(`Catering Enquiry – ${event} | ${name}`);
    const body = encodeURIComponent(
      `Hello Kitchen Da Avenue,\n\n` +
      `I would like to enquire about catering for the following event:\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone / WhatsApp: ${phone || 'Not provided'}\n` +
      `Event Type: ${event}\n` +
      `Estimated Guests: ${guests || 'Not specified'}\n\n` +
      `Message / Details:\n${message}\n\n` +
      `Kind regards,\n${name}`
    );

    window.location.href = `mailto:info@kitchendaavenue.co.za?subject=${subject}&body=${body}`;
    showFormFeedback('Opening your email client...', 'success');
    contactForm.reset();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormFeedback(msg, type) {
  let existing = contactForm.querySelector('.form-feedback');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'form-feedback';
  div.textContent = msg;
  div.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 12px;
    font-weight: 600;
    font-size: 0.9rem;
    background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
    color: ${type === 'success' ? '#155724' : '#721c24'};
    border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
  `;
  contactForm.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

/* ── SMOOTH ANCHOR SCROLL ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
