// Format selector (Physical vs eBook) for book cards & book pages.
// Powers the ORDER PHYSICAL / GET ACCESS TO READ ONLINE choice and sends the
// selected format + price to the cart (cart.js must be loaded first).
(function () {
  if (window.AMFmt) return;

  function money(n) {
    return '\u20A8 ' + Number(n || 0).toLocaleString('en-US');
  }

  // Inject the small amount of styling the selector needs, using the site's
  // CSS variables so it matches the existing buttons on every page.
  var css =
    '.fmt{display:block;width:100%}' +
    '.fmt-opts{display:flex;gap:0.375rem;margin:0 0 0.5rem}' +
    '.fmt-opt{flex:1 1 0;min-width:0;border:1.5px solid var(--border);background:var(--background);color:var(--foreground);opacity:0.85;cursor:pointer;border-radius:9999px;padding:0.4rem 0.5rem;font-size:0.625rem;line-height:1.25;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;text-align:center;transition:background .2s,color .2s,border-color .2s,opacity .2s}' +
    '.fmt-opt:hover{opacity:1}' +
    '.fmt-opt.on{background:var(--primary);border-color:var(--primary);color:var(--primary-foreground);opacity:1}' +
    '.fmt-price{margin:0 0 0.6rem;font-weight:700;text-align:center}' +
    '.fmt-btns{display:flex;gap:0.5rem;justify-content:center}' +
    '.fmt-btn{flex:1 1 0;min-width:0;border:none;cursor:pointer;border-radius:0.375rem;padding:0.5rem;font-weight:500;font-size:0.75rem;text-align:center}' +
    '.fmt-btn.fmt-buy{background:var(--primary);color:var(--primary-foreground)}' +
    '.fmt-btn.fmt-add{background:var(--secondary);color:var(--secondary-foreground)}' +
    '.fmt-lg .fmt-opt{padding:0.7rem 1rem;font-size:0.8rem}' +
    '.fmt-lg .fmt-price{font-size:1.4rem;margin-bottom:1rem}' +
    '.fmt-lg .fmt-btn{padding:0.8rem 1rem;font-size:0.95rem}' +
    '.fmt-heart{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:2.25rem;height:2.25rem;border:1px solid var(--border);border-radius:0.375rem;background:var(--background);color:var(--foreground);opacity:.85;cursor:pointer;transition:color .2s,opacity .2s}' +
    '.fmt-heart:hover{opacity:1}' +
    '.fmt-heart.wished{color:#f73a5a;border-color:#f73a5a}' +
    '.fmt-heart.wished svg{fill:currentColor}' +
    '';
  var styleEl = document.createElement('style');
  styleEl.setAttribute('data-fmt', '1');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function fmtRoot(node) {
    var el = node;
    while (el && !(el.classList && el.classList.contains('fmt'))) el = el.parentElement;
    return el || document.body;
  }

  function select(btn, ev) {
    if (ev) { if (ev.preventDefault) ev.preventDefault(); if (ev.stopPropagation) ev.stopPropagation(); }
    var root = fmtRoot(btn);
    if (!root) return;
    var opts = root.querySelectorAll('.fmt-opt');
    for (var i = 0; i < opts.length; i++) opts[i].classList.remove('on');
    btn.classList.add('on');
    root.setAttribute('data-price', btn.getAttribute('data-price'));
    root.setAttribute('data-fmt', btn.getAttribute('data-fmt') || 'Physical');
    var priceEl = root.querySelector('.fmt-price');
    if (priceEl) priceEl.textContent = money(btn.getAttribute('data-price'));
  }

  function add(btn, ev) {
    if (ev) { if (ev.preventDefault) ev.preventDefault(); if (ev.stopPropagation) ev.stopPropagation(); }
    var root = fmtRoot(btn);
    if (!root || !window.AMCart) return;
    var item = {
      slug: root.getAttribute('data-slug'),
      title: root.getAttribute('data-title'),
      price: parseInt(root.getAttribute('data-price'), 10) || 0,
      fmt: root.getAttribute('data-fmt') || 'Physical'
    };
    window.AMCart.addToCart(item);
  }

  function wish(btn, ev) {
    if (ev) { if (ev.preventDefault) ev.preventDefault(); if (ev.stopPropagation) ev.stopPropagation(); }
    var host = btn.closest ? (btn.closest('[data-wish]') || btn.closest('.fmt')) : null;
    if (!host || !window.AMWishlist) return;
    var slug = host.getAttribute('data-wish-slug') || host.getAttribute('data-slug');
    var title = host.getAttribute('data-wish-title') || host.getAttribute('data-title');
    var price = parseInt(host.getAttribute('data-wish-price') || host.getAttribute('data-price'), 10) || 0;
    if (!slug) return;
    if (window.AMWishlist.isIn(slug)) {
      window.AMWishlist.remove(slug);
      btn.classList && btn.classList.remove('wished');
    } else {
      window.AMWishlist.add({ slug: slug, title: title, price: price, cover: '' });
      btn.classList && btn.classList.add('wished');
    }
  }

  window.AMFmt = { select: select, add: add, wish: wish };
})();
