/* ═══════════════════════════════════════════════════════════════════
   Portfolio — Script
   Handles: mobile menu, smooth scroll, active nav tracking,
            scroll-reveal animations
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ——— DOM References ———
  const sidebar    = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const overlay    = document.getElementById('overlay');
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('.section');
  const reveals    = document.querySelectorAll('.reveal');


  /* ═══════════════════════════════════════════════════════════════
     1. MOBILE MENU
     ═══════════════════════════════════════════════════════════════ */
  function openMenu() {
    sidebar.classList.add('open');
    menuToggle.classList.add('active');
    overlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    menuToggle.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    sidebar.classList.contains('open') ? closeMenu() : openMenu();
  }

  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on nav link click (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMenu();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ═══════════════════════════════════════════════════════════════
     2. SMOOTH SCROLL WITH OFFSET
     ═══════════════════════════════════════════════════════════════ */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const offset = window.innerWidth <= 768 ? 80 : 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ═══════════════════════════════════════════════════════════════
     3. ACTIVE NAV TRACKING (Intersection Observer)
     ═══════════════════════════════════════════════════════════════ */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          navLinks.forEach(link => {
            const section = link.getAttribute('data-section');
            if (section === id) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => {
    if (section.id) {
      sectionObserver.observe(section);
    }
  });


  /* ═══════════════════════════════════════════════════════════════
     4. SCROLL REVEAL ANIMATION
     ═══════════════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1,
    }
  );

  reveals.forEach(el => revealObserver.observe(el));


  /* ═══════════════════════════════════════════════════════════════
     5. STAGGER REVEAL FOR GRID ITEMS
     ═══════════════════════════════════════════════════════════════ */
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 100}ms`;
  });

  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
  });

  /* ═══════════════════════════════════════════════════════════════
     5.5. PROJECT CAROUSEL SWAP
     ═══════════════════════════════════════════════════════════════ */
  const carousels = document.querySelectorAll('.project-carousel');
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-item');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentIndex = 0;

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      indicators.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    prev?.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    next?.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    indicators.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = index;
        updateCarousel();
      });
    });

    updateCarousel();
  });


  /* ═══════════════════════════════════════════════════════════════
     6. RESIZE HANDLER — Reset mobile state on desktop
     ═══════════════════════════════════════════════════════════════ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    }, 150);
  });


  /* ═══════════════════════════════════════════════════════════════
     7. CURRENT YEAR (Footer)
     ═══════════════════════════════════════════════════════════════ */
  const yearEl = document.querySelector('.footer-text');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace(/\d{4}/, year);
  }


  /* ═══════════════════════════════════════════════════════════════
     8. INTERACTIVE SPOTLIGHT GLOW
     ═══════════════════════════════════════════════════════════════ */
  document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
  });

})();
