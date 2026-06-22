/* MAK Painting Group — JS */

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  burger.children[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  burger.children[1].style.opacity = isOpen ? '0' : '';
  burger.children[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.children[0].style.transform = '';
    burger.children[1].style.opacity = '';
    burger.children[2].style.transform = '';
  });
});

// Hero image load animation
document.querySelector('.hero').classList.add('loaded');

// Intersection Observer for fade-up animations
const fadeEls = document.querySelectorAll(
  '.service-card, .process__step, .gallery__item, .testimonial, .stats__item, .contact__detail'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// Counter animation for stats
const statNums = document.querySelectorAll('.stats__num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Contact form submission
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    form.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
    btn.textContent = 'Send Enquiry';
    btn.disabled = false;
    successMsg.classList.add('visible');
    setTimeout(() => successMsg.classList.remove('visible'), 6000);
  }, 1200);
});

// Smooth section reveal for about, process, cta-banner
const sectionEls = document.querySelectorAll('.about__content, .about__image, .cta-banner__content, .section__header');
sectionEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .8s cubic-bezier(.25,.46,.45,.94), transform .8s cubic-bezier(.25,.46,.45,.94)';
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

sectionEls.forEach(el => sectionObserver.observe(el));
