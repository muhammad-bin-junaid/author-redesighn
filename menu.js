/* Mobile menu toggle for the static Ayesha Marfani site. */
(function () {
  function initMenu() {
    var btn = document.querySelector('[aria-label="Open menu"]');
    if (!btn) return;
    var menu = btn.closest('nav') ? btn.closest('nav').nextElementSibling : null;
    if (!menu || !menu.classList.contains('lg:hidden')) return;

    var open = false;
    var MENU_ICON = '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>';
    var CLOSE_ICON = '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>';
    var iconWrap = btn.querySelector('svg');

    function setOpen(value) {
      open = value;
      btn.setAttribute('aria-expanded', value ? 'true' : 'false');
      if (iconWrap) iconWrap.innerHTML = value ? CLOSE_ICON : MENU_ICON;
      if (value) {
        menu.style.opacity = '1';
        menu.style.pointerEvents = 'auto';
        menu.style.visibility = 'visible';
        animateMenuItems(menu, true);
      } else {
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
        menu.style.visibility = 'hidden';
        animateMenuItems(menu, false);
      }
    }

    function animateMenuItems(container, show) {
      var items = container.querySelectorAll('a');
      items.forEach(function (item, i) {
        if (show) {
          item.style.transitionDelay = 75 * i + 'ms';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        } else {
          item.style.transitionDelay = '0ms';
          item.style.opacity = '0';
          item.style.transform = 'translateY(1rem)';
        }
      });
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!open);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) setOpen(false);
    });

    // Close mobile menu when clicking a link
    var links = menu.querySelectorAll('a');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();
