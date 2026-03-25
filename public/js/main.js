/* ============================================
   PIGEON'S BLOG — Interactions & Animations
   Scroll reveals, reading progress, TOC tracking,
   halftone parallax, and micro-interactions.
   ============================================ */

(function () {
  'use strict';

  // --- Scroll Reveal (IntersectionObserver) ---
  let revealObserver = null;
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // --- Post Content Element Reveals ---
  const postContentEls = document.querySelectorAll('.post-content > .container > *');

  if (postContentEls.length && 'IntersectionObserver' in window) {
    const contentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            contentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    postContentEls.forEach((el) => contentObserver.observe(el));
  }

  // --- Nav Scroll Behavior ---
  const nav = document.getElementById('nav');

  if (nav) {
    let lastScrollY = 0;

    const handleNavScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 80) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
  }

  // --- Reading Progress Bar ---
  const progressBar = document.getElementById('progressBar');

  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // --- Back to Top Button ---
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    const handleBackToTopVisibility = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Table of Contents Active State ---
  const toc = document.getElementById('toc');

  if (toc) {
    const tocItems = toc.querySelectorAll('.toc__item');
    const sections = [];

    tocItems.forEach((item) => {
      const sectionId = item.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) {
        sections.push({ el: section, item: item });
      }
    });

    if (sections.length) {
      const updateTOC = () => {
        const scrollY = window.scrollY + window.innerHeight * 0.35;

        let activeIndex = 0;

        sections.forEach((s, i) => {
          const top = s.el.getBoundingClientRect().top + window.scrollY;
          if (scrollY >= top) {
            activeIndex = i;
          }
        });

        tocItems.forEach((item) => item.classList.remove('active'));
        sections[activeIndex].item.classList.add('active');
      };

      window.addEventListener('scroll', updateTOC, { passive: true });
      updateTOC();
    }
  }

  // --- Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --- Halftone Parallax on Hero (subtle) ---
  const heroHalftone = document.querySelector('.hero__halftone-bg, .post-hero__halftone');

  if (heroHalftone) {
    const handleHeroParallax = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const translateY = scrollY * 0.15;
        heroHalftone.style.transform = `rotate(-12deg) translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleHeroParallax, { passive: true });
  }

  // --- Post Hero Halftone Parallax ---
  const postHalftone = document.querySelector('.post-hero__halftone');

  if (postHalftone) {
    const handlePostParallax = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        postHalftone.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handlePostParallax, { passive: true });
  }

  // --- Chapter Number Parallax (subtle float) ---
  const chapterNumbers = document.querySelectorAll('.chapter-number');

  if (chapterNumbers.length) {
    const handleChapterParallax = () => {
      chapterNumbers.forEach((num) => {
        const rect = num.parentElement.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const offset = (elementCenter - viewportCenter) * 0.03;

        num.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', handleChapterParallax, { passive: true });
  }

  // --- Stagger animation for principles lists ---
  const principlesLists = document.querySelectorAll('.principles-list');

  if (principlesLists.length && 'IntersectionObserver' in window) {
    principlesLists.forEach((list) => {
      const items = list.querySelectorAll('li');

      const listObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              items.forEach((item, i) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(16px)';
                item.style.transition = `opacity 0.5s ${0.1 * i}s var(--ease-out), transform 0.5s ${0.1 * i}s var(--ease-out)`;

                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                  });
                });
              });

              listObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      listObserver.observe(list);
    });
  }

  // --- Dynamic halftone dot cursor trail (post page only, desktop) ---
  if (document.querySelector('.post-content') && window.innerWidth > 1024) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:0.06;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let dots = [];
    let mouseX = 0;
    let mouseY = 0;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (frame % 3 === 0) {
        dots.push({
          x: mouseX,
          y: mouseY,
          life: 1,
          size: 2 + Math.random() * 2,
        });
      }

      frame++;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      dots = dots.filter((d) => d.life > 0);

      dots.forEach((d) => {
        d.life -= 0.025;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26, 26, 46, ${d.life * 0.5})`;
        ctx.fill();
      });

      // Keep the array from growing too large
      if (dots.length > 100) {
        dots = dots.slice(-80);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  // --- Language Toggle ---
  var LANG_KEY = 'sparrowhawk-lang';
  var htmlEl = document.documentElement;
  var langToggle = document.getElementById('langToggle');
  var zhFontLoaded = false;

  function loadZhFont() {
    if (zhFontLoaded) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap';
    document.head.appendChild(link);
    zhFontLoaded = true;
  }

  function setLanguage(lang) {
    htmlEl.setAttribute('lang', lang);
    localStorage.setItem(LANG_KEY, lang);

    // Update toggle active states
    if (langToggle) {
      langToggle.querySelectorAll('.lang-toggle__label').forEach(function (label) {
        label.classList.toggle(
          'lang-toggle__label--active',
          label.getAttribute('data-lang') === lang
        );
      });
    }

    // Update document title
    var titleEl = document.querySelector('title');
    if (titleEl) {
      var titleText = titleEl.getAttribute('data-lang-' + lang);
      if (titleText) titleEl.textContent = titleText;
    }

    // Lazy-load Chinese font
    if (lang === 'zh') loadZhFont();

    // After language switch, make all reveal elements in the active language visible.
    // IntersectionObserver can't reliably observe elements that were display:none,
    // so we directly add .visible instead of re-observing.
    requestAnimationFrame(function () {
      document.querySelectorAll('[lang="' + lang + '"] .reveal:not(.visible)').forEach(function (el) {
        el.classList.add('visible');
      });
    });
  }

  function initLanguage() {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored === 'en' || stored === 'zh') {
      setLanguage(stored);
      return;
    }
    // Auto-detect from browser
    var browserLang = navigator.language || (navigator.languages && navigator.languages[0]) || 'en';
    if (browserLang.indexOf('zh') === 0) {
      setLanguage('zh');
    }
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = htmlEl.getAttribute('lang');
      setLanguage(current === 'zh' ? 'en' : 'zh');
    });
  }

  initLanguage();
})();
