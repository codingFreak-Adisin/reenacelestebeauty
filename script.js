const header = document.querySelector('[data-header]');
const progress = document.querySelector('.page-progress span');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = [...document.querySelectorAll('.desktop-nav a')];

const updateScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max ? (y / max) * 100 : 0}%`;
};

updateScroll();
window.addEventListener('scroll', updateScroll, { passive: true });

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
});

mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%', threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.gallery-item').forEach((item) => {
      const visible = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !visible);
    });
  });
});

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const wasOpen = button.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-item button').forEach((item) => item.setAttribute('aria-expanded', 'false'));
    if (!wasOpen) button.setAttribute('aria-expanded', 'true');
  });
});

const WHATSAPP_NUMBER = '919371555393';
const form = document.querySelector('.enquiry-form');
const toast = document.querySelector('.toast');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const date = data.get('date')
    ? new Date(`${data.get('date')}T00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'To be confirmed';
  const message = [
    'Hello Reena! I would like to enquire with Reena Celeste Beauty.',
    '',
    `Name: ${data.get('name')}`,
    `Service: ${data.get('service')}`,
    `Event date: ${date}`,
    `Details: ${data.get('message').trim() || 'I would love to discuss my look.'}`
  ].join('\n');
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // Open synchronously so the click still counts as a user gesture for popup blockers.
  const whatsappWindow = window.open(whatsappUrl, '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  else window.location.href = whatsappUrl;
  try { await navigator.clipboard.writeText(message); } catch (_) { /* Clipboard can be unavailable on local HTTP. */ }
  toast.classList.add('is-visible');
  document.querySelector('.form-note').textContent = 'WhatsApp is open with your brief. Just tap send.';
  setTimeout(() => toast.classList.remove('is-visible'), 3000);
});

const heroVisual = document.querySelector('.hero-visual');
if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.querySelector('.mini-look').style.transform = `translate(${x * 10}px, ${y * 10}px)`;
    heroVisual.querySelector('.floating-note').style.transform = `translate(${x * -8}px, ${y * -8}px) rotate(2deg)`;
  });
}
