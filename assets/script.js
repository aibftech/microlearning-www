/* ============================================================
   MicroLearn — sito di presentazione
   Interazioni: menu mobile, FAQ, mini-player demo, form, scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const open = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // chiudi su click link
    navMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMenu.classList.remove('open'))
    );
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // chiudi tutti gli altri
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ---------- Demo mini-player ---------- */
  const demoPlayer = document.querySelector('.demo-player');
  if (demoPlayer) {
    const slides = demoPlayer.querySelectorAll('.demo-slide');
    const dots = demoPlayer.querySelectorAll('.demo-progress span');
    const prevBtn = demoPlayer.querySelector('.demo-nav-btn.prev');
    const nextBtn = demoPlayer.querySelector('.demo-nav-btn.next');
    let current = 0;

    const render = () => {
      slides.forEach((s, i) => {
        s.style.display = i === current ? 'flex' : 'none';
      });
      dots.forEach((d, i) => {
        d.classList.remove('active', 'done');
        if (i < current) d.classList.add('done');
        else if (i === current) d.classList.add('active');
      });
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) {
        if (current === slides.length - 1) {
          nextBtn.textContent = 'Ricomincia ↺';
        } else {
          nextBtn.textContent = 'Avanti →';
        }
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (current > 0) { current--; render(); }
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (current < slides.length - 1) { current++; }
        else { current = 0; }
        render();
      });
    }

    // Quiz interattivo
    const quizOptions = demoPlayer.querySelectorAll('.demo-quiz-opt');
    quizOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const isCorrect = opt.dataset.correct === 'true';
        // reset stati nello stesso quiz
        const parent = opt.closest('.demo-slide');
        parent.querySelectorAll('.demo-quiz-opt').forEach(o => {
          o.classList.remove('selected', 'correct', 'wrong');
        });
        opt.classList.add('selected');
        if (isCorrect) opt.classList.add('correct');
        else {
          opt.classList.add('wrong');
          // mostra anche la risposta corretta
          parent.querySelectorAll('.demo-quiz-opt').forEach(o => {
            if (o.dataset.correct === 'true') o.classList.add('correct');
          });
        }
      });
    });

    render();
  }

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    // fallback: tutto visibile
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ---------- Form demo (handler simulato) ---------- */
  const demoForm = document.querySelector('#demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = demoForm.querySelector('.form-success');
      // qui in produzione: fetch verso backend / Formspree / simile
      demoForm.reset();
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  /* ---------- Topbar shadow on scroll ---------- */
  const topbar = document.querySelector('.topbar');
  if (topbar) {
    const onScroll = () => {
      if (window.scrollY > 8) topbar.style.boxShadow = 'var(--shadow-sm)';
      else topbar.style.boxShadow = 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Anno corrente in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
