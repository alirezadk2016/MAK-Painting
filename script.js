// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile burger
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.children[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  burger.children[1].style.opacity = open ? '0' : '';
  burger.children[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.children[0].style.transform = '';
    burger.children[1].style.opacity = '';
    burger.children[2].style.transform = '';
  });
});

// Fade-up on scroll
const fadeEls = document.querySelectorAll('.scard, .review-card, .how__steps li, .faq__item, .trust-item, .contact__detail');
fadeEls.forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => io.observe(el));

// Section reveals
const sectionReveal = document.querySelectorAll('.section__header, .how__content, .how__visual, .about__content, .about__images, .faq__header, .contact__info');
sectionReveal.forEach(el => {
  el.style.cssText += 'opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease';
});
const sr = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      sr.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
sectionReveal.forEach(el => sr.observe(el));

// Counter animation
const statEls = document.querySelectorAll('.about__stat-num');
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animCount(e.target); counterIO.unobserve(e.target); }
  });
}, { threshold: 0.5 });
statEls.forEach(el => counterIO.observe(el));

function animCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const start = performance.now();
  const dur = 1600;
  (function step(now) {
    const t = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - t, 3)) * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(start);
}

// FAQ accordion
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const answer = item.querySelector('.faq__a');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // close all
    document.querySelectorAll('.faq__q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.faq__item').querySelector('.faq__a').style.maxHeight = '0';
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Contact form
const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type=submit]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send enquiry';
    btn.disabled = false;
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 6000);
  }, 1200);
});
