/* ==========================================================================
   R VIDHYA RAJ — PORTFOLIO SCRIPT
   Vanilla JS: splash, nav, particle bg, scroll reveal, counters,
   certification tabs, modals, contact form + EmailJS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- SPLASH SCREEN ---------------- */
  const splash = document.getElementById('splash-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });
  // Safety fallback in case load event already fired
  setTimeout(() => {
    if (splash && !splash.classList.contains('hidden')) {
      splash.classList.add('hidden');
    }
  }, 3500);

  /* ---------------- FOOTER YEAR ---------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- NAVBAR SCROLL STATE ---------------- */
  const navbar = document.getElementById('navbar');
  const onScrollNav = () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------------- MOBILE MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- ACTIVE SECTION HIGHLIGHT ---------------- */
  const sections = document.querySelectorAll('main .section, header#navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionEls = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sectionEls.forEach(sec => sectionObserver.observe(sec));

  /* ---------------- SCROLL REVEAL (Intersection Observer) ---------------- */
  const animatedEls = document.querySelectorAll('[data-animate]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
        el.style.animationDelay = `${delay}ms`;
        el.classList.add('in-view');
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  animatedEls.forEach(el => revealObserver.observe(el));

    /* ---------------- STAT COUNTER ANIMATION ---------------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const isDecimal = el.hasAttribute('data-decimal');
    const target = parseFloat(el.dataset.count || el.dataset.decimal);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(2) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---------------- CERTIFICATION TABS ---------------- */
  const certTabs = document.querySelectorAll('.cert-tab');
  const certPanels = document.querySelectorAll('.cert-panel');
  certTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const org = tab.dataset.certOrg;
      certTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      certPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.certPanel === org);
      });
    });
  });

  /* ---------------- MODALS ---------------- */
  const imageModal = document.getElementById('image-modal');
  const imageModalImg = document.getElementById('image-modal-img');
  const imageModalTitle = document.getElementById('image-modal-title');
  const imageModalClose = document.getElementById('image-modal-close');
  const imageModalWrap = document.getElementById('image-modal-wrap');
  const modalPrevBtn = document.getElementById('modal-prev');
  const modalNextBtn = document.getElementById('modal-next');
  const modalCounter = document.getElementById('modal-counter');
  const zoomInBtn = document.getElementById('modal-zoom-in');
  const zoomOutBtn = document.getElementById('modal-zoom-out');
  const zoomResetBtn = document.getElementById('modal-zoom-reset');
  const zoomLevelLabel = document.getElementById('modal-zoom-level');

  function openModal(modalEl) {
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modalEl) {
    modalEl.classList.remove('open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---- Certificate viewer state (zoom + group navigation) ---- */
  let viewerGroup = [];   // [{src, title}]
  let viewerIndex = 0;
  let zoomLevel = 1;
  const ZOOM_MIN = 1, ZOOM_MAX = 3, ZOOM_STEP = 0.25;

  function setZoom(level) {
    zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, level));
    imageModalImg.style.transform = `scale(${zoomLevel})`;
    zoomLevelLabel.textContent = `${Math.round(zoomLevel * 100)}%`;
    imageModalWrap.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
  }

  function renderViewerItem() {
    const item = viewerGroup[viewerIndex];
    if (!item) return;
    imageModalImg.src = item.src;
    imageModalImg.alt = item.title;
    imageModalTitle.textContent = item.title;
    setZoom(1);
    imageModalWrap.scrollTop = 0;

    const hasGroup = viewerGroup.length > 1;
    modalPrevBtn.hidden = !hasGroup;
    modalNextBtn.hidden = !hasGroup;
    modalPrevBtn.disabled = viewerIndex === 0;
    modalNextBtn.disabled = viewerIndex === viewerGroup.length - 1;
    modalCounter.textContent = hasGroup ? `${viewerIndex + 1} / ${viewerGroup.length}` : '';
  }

  function openViewer(group, startIndex, title) {
    viewerGroup = group;
    viewerIndex = startIndex;
    if (title && viewerGroup.length <= 1) {
      viewerGroup = [{ src: viewerGroup[startIndex].src, title }];
      viewerIndex = 0;
    }
    renderViewerItem();
    openModal(imageModal);
  }

  modalPrevBtn.addEventListener('click', () => {
    if (viewerIndex > 0) { viewerIndex--; renderViewerItem(); }
  });
  modalNextBtn.addEventListener('click', () => {
    if (viewerIndex < viewerGroup.length - 1) { viewerIndex++; renderViewerItem(); }
  });

  zoomInBtn.addEventListener('click', () => setZoom(zoomLevel + ZOOM_STEP));
  zoomOutBtn.addEventListener('click', () => setZoom(zoomLevel - ZOOM_STEP));
  zoomResetBtn.addEventListener('click', () => setZoom(1));
  imageModalImg.addEventListener('dblclick', () => setZoom(zoomLevel > 1 ? 1 : 2));

  // Generic single-image triggers (achievements — no group)
  document.querySelectorAll('[data-modal-image]').forEach(trigger => {
    // Skip cert-items here; they are handled below with group context
    if (trigger.classList.contains('cert-item')) return;
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-modal-image');
      const title = trigger.getAttribute('data-modal-title') || '';
      openViewer([{ src, title }], 0);
    });
  });

  // Certification items — grouped by organization panel for prev/next navigation
  document.querySelectorAll('.cert-panel').forEach(panel => {
    const items = Array.from(panel.querySelectorAll('.cert-item[data-modal-image]'));
    const group = items.map(item => ({
      src: item.getAttribute('data-modal-image'),
      title: item.getAttribute('data-modal-title') || '',
    }));
    items.forEach((item, idx) => {
      item.addEventListener('click', () => openViewer(group, idx));
    });
  });

  // Named modal triggers (patent proof / 1M1B certificate)
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal-trigger');
      const modalEl = document.getElementById(targetId);
      if (modalEl) openModal(modalEl);
    });
  });

  imageModalClose.addEventListener('click', () => closeModal(imageModal));

  document.querySelectorAll('.modal-overlay').forEach(modalEl => {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal(modalEl);
    });
    modalEl.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(modalEl));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!imageModal.classList.contains('open')) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m));
      }
      return;
    }
    // Keyboard navigation inside the certificate viewer
    if (e.key === 'Escape') closeModal(imageModal);
    else if (e.key === 'ArrowLeft' && !modalPrevBtn.disabled && !modalPrevBtn.hidden) modalPrevBtn.click();
    else if (e.key === 'ArrowRight' && !modalNextBtn.disabled && !modalNextBtn.hidden) modalNextBtn.click();
    else if (e.key === '+' || e.key === '=') setZoom(zoomLevel + ZOOM_STEP);
    else if (e.key === '-') setZoom(zoomLevel - ZOOM_STEP);
  });

  /* ---------------- TOASTS ---------------- */
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : '⚠️';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, 4200);
  }

  /* ---------------- CONTACT FORM VALIDATION + EMAILJS ---------------- */
  const EMAILJS_SERVICE_ID = 'service_q0ilyxr';
  const EMAILJS_TEMPLATE_ID = 'template_wnqxswb';
  const EMAILJS_PUBLIC_KEY = 'si5NGB-aWE1ceWpTJ';

  // Load EmailJS SDK dynamically
  (function loadEmailJS() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => {
      if (window.emailjs) window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    };
    document.head.appendChild(script);
  })();

  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');

  function validateField(id, condition, message) {
    const field = document.getElementById(id);
    const errorEl = document.querySelector(`[data-error-for="${id}"]`);
    const wrapper = field.closest('.form-field');
    if (!condition) {
      wrapper.classList.add('error');
      if (errorEl) errorEl.textContent = message;
      return false;
    }
    wrapper.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validName = validateField('cf-name', name.length >= 2, 'Please enter your name.');
    const validEmail = validateField('cf-email', emailPattern.test(email), 'Please enter a valid email address.');
    const validSubject = validateField('cf-subject', subject.length >= 3, 'Please enter a subject.');
    const validMessage = validateField('cf-message', message.length >= 10, 'Message should be at least 10 characters.');

    if (!(validName && validEmail && validSubject && validMessage)) {
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    const sendPayload = {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message,
    };

    function finish(success) {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
      if (success) {
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        showToast('Something went wrong. Please try again or email me directly.', 'error');
      }
    }

    function attemptSend(retries) {
      if (window.emailjs && window.emailjs.send) {
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, sendPayload)
          .then(() => finish(true))
          .catch(() => finish(false));
      } else if (retries > 0) {
        setTimeout(() => attemptSend(retries - 1), 400);
      } else {
        finish(false);
      }
    }

    attemptSend(8);
  });

  /* ---------------- PARTICLE / CONSTELLATION BACKGROUND ---------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = Math.min(70, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      hue: Math.random(),
    }));
  }

  const colors = ['59,130,246', '168,85,247', '34,211,238'];

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    const maxDist = 140;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.16;
          ctx.strokeStyle = `rgba(${colors[i % 3]},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors[Math.floor(p.hue * 3)]},0.7)`;
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initParticles();
      if (prefersReducedMotion) drawParticles();
    }, 200);
  });

  /* ---------------- LAZY LOAD FALLBACK FOR OLDER BROWSERS ---------------- */
  if (!('loading' in HTMLImageElement.prototype)) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          obs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

});
