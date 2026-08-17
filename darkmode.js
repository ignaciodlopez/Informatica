(function () {
  const ROOT = document.documentElement;
  const KEY = 'theme';

  const MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const SUN  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  if (localStorage.getItem(KEY) === 'dark') {
    ROOT.setAttribute('data-theme', 'dark');
  }

  function init() {
    const btn = document.getElementById('darkmode-toggle');
    if (!btn) return;
    sync(btn);
    btn.addEventListener('click', function () {
      const isDark = ROOT.getAttribute('data-theme') === 'dark';
      if (isDark) {
        ROOT.removeAttribute('data-theme');
        localStorage.setItem(KEY, 'light');
      } else {
        ROOT.setAttribute('data-theme', 'dark');
        localStorage.setItem(KEY, 'dark');
      }
      sync(btn);
    });
  }

  function sync(btn) {
    const isDark = ROOT.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark ? SUN : MOON;
    btn.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
    btn.setAttribute('title',      isDark ? 'Modo claro'         : 'Modo oscuro');
  }

  function initNav() {
    const nav = document.querySelector('.topbar-nav');
    if (!nav) return;

    nav.addEventListener('wheel', function (e) {
      if (nav.scrollWidth <= nav.clientWidth) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        nav.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    const links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;
    const sections = links
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    let current = null;
    function setActive(id) {
      links.forEach(function (a) {
        const isActive = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', isActive);
        if (isActive) {
          a.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.id !== current) {
          current = entry.target.id;
          setActive(current);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      initNav();
    });
  } else {
    init();
    initNav();
  }
})();
