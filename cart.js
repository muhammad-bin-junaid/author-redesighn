// Cart Sidebar Component
(function() {
  const CART_KEY = 'ayeshamarfani-cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch(e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(item) {
    const cart = getCart();
    // Keep Physical and eBook (read online) versions of the same book separate,
    // so each line carries the price of the format the shopper actually chose.
    const fmt = item.fmt || 'Physical';
    const key = (item.slug || '') + '|' + fmt;
    const existing = cart.find(i => i.slug === key);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ slug: key, title: item.title, price: item.price, fmt: fmt, cover: item.cover || '', qty: 1 });
    }
    saveCart(cart);
    openCartSidebar();
  }

  function removeFromCart(slug) {
    let cart = getCart().filter(i => i.slug !== slug);
    saveCart(cart);
    renderCartItems();
  }

  function updateQty(slug, delta) {
    const cart = getCart();
    const item = cart.find(i => i.slug === slug);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        saveCart(cart.filter(i => i.slug !== slug));
      } else {
        saveCart(cart);
      }
      renderCartItems();
    }
  }

  function getCartTotal() {
    return getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
  }

  function getCartCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function updateCartCount() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const emptyEl = document.getElementById('cart-empty');
    const footerEl = document.getElementById('cart-footer');
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    container.innerHTML = cart.map(item => {
      const coverHTML = item.cover
        ? '<img src="' + item.cover + '" alt="" style="width:4rem;height:5rem;object-fit:cover;border-radius:0.25rem"/>'
        : '<div style="width:4rem;height:5rem;border-radius:0.25rem;background:linear-gradient(135deg,#fce4ec,#f8bbd0);display:flex;align-items:center;justify-content:center;font-size:0.75rem;opacity:0.4">No Image</div>';
      return '<div style="display:flex;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--border)">' +
        coverHTML +
        '<div style="flex:1;min-width:0">' +
          '<p style="font-weight:500;font-size:0.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + item.title + '</p>' +
          '<p style="opacity:0.6;font-size:0.875rem">' + (item.fmt === 'eBook' ? '\u2022 eBook / Read online' : '\u2022 Physical') + '</p>' +
          '<p style="opacity:0.6;font-size:0.875rem">\u20A8 ' + item.price.toLocaleString() + '</p>' +
          '<div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.25rem">' +
            '<button onclick="window.AMCart.updateQty(\'' + item.slug + '\',-1)" style="width:1.5rem;height:1.5rem;border-radius:0.25rem;background:var(--secondary);font-size:0.75rem;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">-</button>' +
            '<span style="font-size:0.875rem;font-weight:500;width:1rem;text-align:center">' + item.qty + '</span>' +
            '<button onclick="window.AMCart.updateQty(\'' + item.slug + '\',1)" style="width:1.5rem;height:1.5rem;border-radius:0.25rem;background:var(--secondary);font-size:0.75rem;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">+</button>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<p style="font-size:0.875rem;font-weight:700">\u20A8 ' + (item.price * item.qty).toLocaleString() + '</p>' +
          '<button onclick="window.AMCart.removeFromCart(\'' + item.slug + '\')" style="font-size:0.75rem;color:var(--primary);text-decoration:underline;cursor:pointer;background:none;border:none;padding:0">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');

    if (totalEl) totalEl.textContent = '\u20A8 ' + getCartTotal().toLocaleString();
  }

  function openCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.style.transform = 'translateX(0)';
    if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto'; }
    document.body.style.overflow = 'hidden';
    renderCartItems();
  }

  function closeCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.style.transform = 'translateX(100%)';
    if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
    document.body.style.overflow = '';
  }

  function toggleCartSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar && sidebar.style.transform === 'translateX(100%)') {
      openCartSidebar();
    } else {
      closeCartSidebar();
    }
  }

  window.AMCart = {
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQty: updateQty,
    open: openCartSidebar,
    close: closeCartSidebar,
    toggle: toggleCartSidebar,
    getCount: getCartCount,
    getTotal: getCartTotal,
    updateCount: updateCartCount
  };

  document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeCartSidebar();
    });
  });
})();
