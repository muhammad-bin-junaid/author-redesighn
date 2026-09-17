// Wishlist Sidebar Component
(function() {
  const WISH_KEY = 'ayeshamarfani-wishlist';

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
    catch(e) { return []; }
  }

  function saveWishlist(list) {
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
    updateWishlistCount();
  }

  function addToWishlist(item) {
    const list = getWishlist();
    const existing = list.find(i => i.slug === item.slug);
    if (!existing) {
      list.push({ slug: item.slug, title: item.title, price: item.price, cover: item.cover || '' });
      saveWishlist(list);
    }
    openWishlistSidebar();
  }

  function removeFromWishlist(slug) {
    let list = getWishlist().filter(i => i.slug !== slug);
    saveWishlist(list);
    renderWishlistItems();
  }

  function isInWishlist(slug) {
    return getWishlist().some(i => i.slug === slug);
  }

  function getWishlistCount() {
    return getWishlist().length;
  }

  function updateWishlistCount() {
    const count = getWishlistCount();
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function renderWishlistItems() {
    const container = document.getElementById('wishlist-items');
    const emptyEl = document.getElementById('wishlist-empty');
    if (!container) return;

    const list = getWishlist();
    if (list.length === 0) {
      container.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    container.innerHTML = list.map(item => {
      const coverHTML = item.cover
        ? '<img src="' + item.cover + '" alt="" style="width:4rem;height:5rem;object-fit:cover;border-radius:0.25rem"/>'
        : '<div style="width:4rem;height:5rem;border-radius:0.25rem;background:linear-gradient(135deg,#fce4ec,#f8bbd0);display:flex;align-items:center;justify-content:center;font-size:0.75rem;opacity:0.4">No Image</div>';
      return '<div style="display:flex;gap:0.75rem;padding:0.75rem 0;border-bottom:1px solid var(--border)">' +
        coverHTML +
        '<div style="flex:1;min-width:0">' +
          '<p style="font-weight:500;font-size:0.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + item.title + '</p>' +
          '<p style="opacity:0.6;font-size:0.875rem">₨ ' + item.price.toLocaleString() + '</p>' +
          '<button onclick="window.AMWishlist.moveToCart(\'' + item.slug + '\')" style="margin-top:0.25rem;font-size:0.75rem;color:var(--primary);text-decoration:underline;cursor:pointer;background:none;border:none;padding:0">Move to Cart</button>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<button onclick="window.AMWishlist.remove(\'' + item.slug + '\')" style="font-size:0.75rem;color:var(--primary);text-decoration:underline;cursor:pointer;background:none;border:none;padding:0">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function openWishlistSidebar() {
    const sidebar = document.getElementById('wishlist-sidebar');
    const overlay = document.getElementById('wishlist-overlay');
    if (sidebar) sidebar.style.transform = 'translateX(0)';
    if (overlay) { overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto'; }
    document.body.style.overflow = 'hidden';
    renderWishlistItems();
  }

  function closeWishlistSidebar() {
    const sidebar = document.getElementById('wishlist-sidebar');
    const overlay = document.getElementById('wishlist-overlay');
    if (sidebar) sidebar.style.transform = 'translateX(100%)';
    if (overlay) { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; }
    document.body.style.overflow = '';
  }

  function toggleWishlistSidebar() {
    const sidebar = document.getElementById('wishlist-sidebar');
    if (sidebar && sidebar.style.transform === 'translateX(100%)') {
      openWishlistSidebar();
    } else {
      closeWishlistSidebar();
    }
  }

  function moveToCart(slug) {
    const list = getWishlist();
    const item = list.find(i => i.slug === slug);
    if (item && window.AMCart) {
      window.AMCart.addToCart({ slug: item.slug, title: item.title, price: item.price, cover: item.cover });
      removeFromWishlist(slug);
    }
  }

  window.AMWishlist = {
    add: addToWishlist,
    remove: removeFromWishlist,
    isIn: isInWishlist,
    open: openWishlistSidebar,
    close: closeWishlistSidebar,
    toggle: toggleWishlistSidebar,
    moveToCart: moveToCart,
    getCount: getWishlistCount,
    updateCount: updateWishlistCount
  };

  document.addEventListener('DOMContentLoaded', function() {
    updateWishlistCount();
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeWishlistSidebar();
    });
  });
})();
