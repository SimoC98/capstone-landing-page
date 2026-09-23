// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.innerHTML = isOpen ? '✕' : '☰';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.innerHTML = '☰';
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

// Sticky nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.12)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.summary-card, .challenge-card, .agent-block, .proof-card, .budget-item, .reason, .scale-card, .step, .waiting-cost, .platform-banner'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Smooth active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--blue)';
    }
  });
});

// Animated counter for stats
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = target.toString().includes('.');

  const step = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isDecimal
      ? (parseFloat(target) * eased).toFixed(1)
      : Math.floor(parseFloat(target) * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// Trigger counters when hero stats become visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValues = entry.target.querySelectorAll('.stat-value');
      statValues.forEach(el => {
        const text = el.textContent;
        // Only animate pure numbers or numbers with K/M prefix
        const match = text.match(/^€?([\d.]+)(K|M)?/);
        if (match) {
          const num = parseFloat(match[1]);
          const suffix = text.replace(match[0], '').trim();
          const prefix = text.startsWith('€') ? '€' : '';
          el.textContent = prefix + '0' + (match[2] || '') + suffix;
          setTimeout(() => {
            animateCounter(el, num, '');
            setTimeout(() => {
              el.textContent = text; // restore original
            }, 1850);
          }, 200);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
