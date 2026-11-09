/* GoScoot shared UI helpers: header, footer, cards, badges, toasts. */
(function () {
  'use strict';

  var Store = window.GS.Store;

  var TONE_CLASSES = {
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    blue: 'bg-sky-50 text-sky-700 ring-sky-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200'
  };

  var LOCATIONS = ['Lucknow', 'Aliganj', 'Gomti Nagar', 'Hazratganj', 'Indira Nagar', 'Vikas Nagar', 'Jankipuram'];

  function money(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN');
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function formatDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  function stars(rating) {
    return '<span class="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">' +
      '<span class="text-amber-500">★</span>' + Number(rating).toFixed(1) + '</span>';
  }

  function discountPercent(mrp, price) {
    if (!mrp || !price || mrp <= price) return 0;
    return Math.round((1 - price / mrp) * 100);
  }

  function statusBadge(status) {
    var meta = Store.STATUS_META[status] || { label: status, tone: 'slate' };
    var classes = TONE_CLASSES[meta.tone] || TONE_CLASSES.slate;
    return '<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ' + classes + '">' +
      esc(meta.label) + '</span>';
  }

  function aggregateBadge(order) {
    var agg = Store.aggregateStatus(order);
    var classes = TONE_CLASSES[agg.tone] || TONE_CLASSES.slate;
    return '<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ' + classes + '">' +
      '<span class="h-1.5 w-1.5 rounded-full bg-current"></span>' + esc(agg.label) + '</span>';
  }

  /* ---------- toast ---------- */

  function toast(message) {
    var wrap = document.getElementById('toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'toast-wrap';
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<i data-lucide="check-circle-2" class="h-4 w-4 text-lime"></i><span>' + esc(message) + '</span>';
    wrap.appendChild(el);
    refreshIcons();
    setTimeout(function () {
      el.style.transition = 'opacity .2s ease, transform .2s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
      setTimeout(function () { el.remove(); }, 220);
    }, 2400);
  }

  /* ---------- cards ---------- */

  function productCard(product, options) {
    options = options || {};
    var base = options.base || '';
    var offers = Store.availableOffers(product);
    var best = offers.length ? offers[0] : null;
    var discount = best ? discountPercent(best.mrp, best.price) : 0;
    var sellerCount = offers.length;

    return '' +
      '<a href="' + base + 'product.html?id=' + encodeURIComponent(product.id) + '" ' +
      'class="group flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-[0_10px_30px_-24px_rgba(23,107,69,.5)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(23,107,69,.55)]">' +
        '<div class="emoji-tile relative m-2 aspect-[5/4] text-5xl">' +
          '<span class="transition group-hover:scale-110">' + esc(product.emoji) + '</span>' +
          (discount ? '<span class="discount-pill absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px]">' + discount + '% off</span>' : '') +
          '<span class="absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-slate-600 backdrop-blur">' +
            sellerCount + (sellerCount === 1 ? ' seller' : ' sellers') +
          '</span>' +
        '</div>' +
        '<div class="flex flex-1 flex-col px-3 pb-3">' +
          '<p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">' + esc(product.brand) + ' · ' + esc(product.unit) + '</p>' +
          '<h3 class="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-ink">' + esc(product.name) + '</h3>' +
          '<div class="mt-auto flex items-end justify-between pt-2">' +
            '<div>' +
              (best
                ? '<div class="flex items-baseline gap-1.5"><span class="text-base font-extrabold text-brand">' + money(best.price) + '</span>' +
                  (best.mrp > best.price ? '<span class="text-[11px] text-slate-400 line-through">' + money(best.mrp) + '</span>' : '') + '</div>' +
                  '<p class="text-[10px] text-slate-400">from ' + sellerCount + (sellerCount === 1 ? ' shop' : ' shops') + '</p>'
                : '<span class="text-xs font-semibold text-rose-500">Out of stock</span>') +
            '</div>' +
            '<span class="grid h-8 w-8 place-items-center rounded-full bg-brand-light text-brand transition group-hover:bg-brand group-hover:text-white">' +
              '<i data-lucide="arrow-up-right" class="h-4 w-4"></i>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function shopCard(seller, options) {
    options = options || {};
    var base = options.base || '';
    return '' +
      '<a href="' + base + 'shop.html?id=' + encodeURIComponent(seller.id) + '" ' +
      'class="group flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(23,107,69,.5)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(23,107,69,.55)]">' +
        '<div class="flex items-start gap-3">' +
          '<div class="emoji-tile h-14 w-14 shrink-0 text-2xl">' + esc(seller.emoji) + '</div>' +
          '<div class="min-w-0 flex-1">' +
            '<h3 class="truncate font-display text-base font-extrabold text-ink">' + esc(seller.name) + '</h3>' +
            '<p class="truncate text-xs text-slate-500">' + esc(seller.category) + ' · ' + esc(seller.location) + '</p>' +
            '<div class="mt-1 flex items-center gap-2">' + stars(seller.rating) +
              '<span class="text-[11px] text-slate-400">' + seller.etaMin + '–' + seller.etaMax + ' min</span>' +
            '</div>' +
          '</div>' +
          '<span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-light text-brand transition group-hover:bg-brand group-hover:text-white">' +
            '<i data-lucide="arrow-up-right" class="h-4 w-4"></i>' +
          '</span>' +
        '</div>' +
        '<div class="mt-4 flex flex-wrap gap-1.5">' +
          seller.tags.map(function (tag) {
            return '<span class="rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-semibold text-brand">' + esc(tag) + '</span>';
          }).join('') +
        '</div>' +
        '<div class="mt-4 grid grid-cols-3 gap-2 border-t border-dashed border-emerald-900/10 pt-3 text-center">' +
          '<div><p class="text-[10px] uppercase tracking-wide text-slate-400">Delivery</p><p class="text-xs font-bold text-ink">' + money(seller.deliveryFee) + '</p></div>' +
          '<div><p class="text-[10px] uppercase tracking-wide text-slate-400">Min order</p><p class="text-xs font-bold text-ink">' + money(seller.minOrder) + '</p></div>' +
          '<div><p class="text-[10px] uppercase tracking-wide text-slate-400">ETA</p><p class="text-xs font-bold text-ink">' + seller.etaMin + '–' + seller.etaMax + 'm</p></div>' +
        '</div>' +
      '</a>';
  }

  function emptyState(icon, title, text, cta) {
    return '' +
      '<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-6 py-16 text-center">' +
        '<div class="grid h-16 w-16 place-items-center rounded-2xl bg-brand-light text-brand">' +
          '<i data-lucide="' + esc(icon || 'inbox') + '" class="h-7 w-7"></i>' +
        '</div>' +
        '<h3 class="mt-4 font-display text-lg font-extrabold text-ink">' + esc(title) + '</h3>' +
        '<p class="mt-1 max-w-sm text-sm text-slate-500">' + esc(text) + '</p>' +
        (cta || '') +
      '</div>';
  }

  /* ---------- header / footer ---------- */

  function headerHTML(base, active) {
    var session = Store.getSession();
    var location = session.location || 'Lucknow';

    function navLink(href, label, key) {
      var isActive = active === key;
      return '<a href="' + base + href + '" class="rounded-full px-3 py-2 text-sm font-semibold transition ' +
        (isActive ? 'bg-brand-light text-brand' : 'text-slate-600 hover:bg-brand-light hover:text-brand') + '">' +
        label + '</a>';
    }

    return '' +
      '<header class="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#f8faf6]/90 backdrop-blur">' +
        '<div class="mx-auto max-w-7xl px-4">' +
          '<div class="flex h-16 items-center gap-3">' +
            '<a href="' + base + 'index.html" class="flex shrink-0 items-center gap-2">' +
              '<span class="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lime shadow-sm">' +
                '<i data-lucide="bike" class="h-5 w-5"></i>' +
              '</span>' +
              '<span class="font-display text-xl font-extrabold tracking-tight text-brand">GoScoot</span>' +
            '</a>' +

            '<label class="ml-1 hidden items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:flex">' +
              '<i data-lucide="map-pin" class="h-3.5 w-3.5 text-brand"></i>' +
              '<span class="text-slate-400">Deliver to</span>' +
              '<select id="locationSelect" class="max-w-[7.5rem] cursor-pointer bg-transparent font-semibold text-ink outline-none">' +
                LOCATIONS.map(function (loc) {
                  return '<option value="' + esc(loc) + '"' + (loc === location ? ' selected' : '') + '>' + esc(loc) + '</option>';
                }).join('') +
              '</select>' +
            '</label>' +

            '<form id="headerSearch" class="hidden flex-1 items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 md:flex">' +
              '<i data-lucide="search" class="h-4 w-4 shrink-0 text-slate-400"></i>' +
              '<input name="q" type="search" placeholder="Search milk, atta, shops…" ' +
                'class="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400">' +
            '</form>' +

            '<nav class="ml-auto flex items-center gap-1">' +
              '<div class="hidden items-center gap-1 md:flex">' +
                navLink('shops.html', 'Shops', 'shops') +
                navLink('products.html', 'Products', 'products') +
              '</div>' +
              '<a href="' + base + 'seller/dashboard.html" class="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-brand-light hover:text-brand lg:inline-flex">' +
                '<i data-lucide="store" class="h-3.5 w-3.5"></i> Seller demo' +
              '</a>' +
              '<a href="' + base + 'cart.html" class="relative ml-1 grid h-10 w-10 place-items-center rounded-full bg-white text-brand ring-1 ring-emerald-900/10 transition hover:bg-brand-light" aria-label="Cart">' +
                '<i data-lucide="shopping-bag" class="h-5 w-5"></i>' +
                '<span id="cartCount" class="absolute -right-0.5 -top-0.5 hidden min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-5 text-white"></span>' +
              '</a>' +
            '</nav>' +
          '</div>' +

          '<form id="mobileSearch" class="pb-3 md:hidden">' +
            '<div class="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 ring-1 ring-emerald-900/10">' +
              '<i data-lucide="search" class="h-4 w-4 shrink-0 text-slate-400"></i>' +
              '<input name="q" type="search" placeholder="Search products or shops…" ' +
                'class="w-full bg-transparent text-sm outline-none placeholder:text-slate-400">' +
            '</div>' +
          '</form>' +

          '<div class="no-scrollbar flex gap-1 overflow-x-auto pb-2 md:hidden">' +
            navLink('index.html', 'Home', 'home') +
            navLink('shops.html', 'Shops', 'shops') +
            navLink('products.html', 'Products', 'products') +
            navLink('cart.html', 'Cart', 'cart') +
            navLink('seller/dashboard.html', 'Seller', 'seller') +
            navLink('operations/dashboard.html', 'Ops', 'operations') +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function footerHTML(base) {
    return '' +
      '<footer class="mt-16 border-t border-emerald-900/10 bg-white">' +
        '<div class="mx-auto max-w-7xl px-4 py-12">' +
          '<div class="grid gap-10 md:grid-cols-4">' +
            '<div class="md:col-span-2">' +
              '<div class="flex items-center gap-2">' +
                '<span class="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lime"><i data-lucide="bike" class="h-5 w-5"></i></span>' +
                '<span class="font-display text-xl font-extrabold tracking-tight text-brand">GoScoot</span>' +
              '</div>' +
              '<p class="mt-3 max-w-md text-sm leading-relaxed text-slate-500">' +
                'Your neighbourhood shops, delivered. Browse independent local sellers, pick the best price, and let GoScoot handle the ride to your door.' +
              '</p>' +
              '<p class="mt-3 max-w-md rounded-xl bg-brand-light px-3 py-2 text-xs leading-relaxed text-brand">' +
                '<strong>GoScoot is a delivery partner.</strong> We do not own shops or products. Every item is sold and packed by an independent local seller.' +
              '</p>' +
            '</div>' +
            '<div>' +
              '<p class="text-xs font-bold uppercase tracking-wider text-slate-400">Shop</p>' +
              '<ul class="mt-3 space-y-2 text-sm text-slate-600">' +
                '<li><a class="hover:text-brand" href="' + base + 'shops.html">Local shops</a></li>' +
                '<li><a class="hover:text-brand" href="' + base + 'products.html">All products</a></li>' +
                '<li><a class="hover:text-brand" href="' + base + 'cart.html">Your cart</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<p class="text-xs font-bold uppercase tracking-wider text-slate-400">Demo</p>' +
              '<ul class="mt-3 space-y-2 text-sm text-slate-600">' +
                '<li><button type="button" id="resetDemoBtn" class="text-left hover:text-brand">Reset demo data</button></li>' +
                '<li><a class="hover:text-brand" href="' + base + 'seller/dashboard.html">Seller dashboard</a></li>' +
                '<li><a class="hover:text-brand" href="' + base + 'operations/dashboard.html">Operations dashboard</a></li>' +
                '<li><span class="text-slate-400">No login · no real payments</span></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="mt-10 flex flex-col gap-2 border-t border-emerald-900/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">' +
            '<p>© 2026 GoScoot. Demo build for demonstration purposes.</p>' +
            '<p>Made for local shops in Lucknow.</p>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- cart bar ---------- */

  function updateCartBar(active, base) {
    var bar = document.getElementById('cart-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'cart-bar';
      document.body.appendChild(bar);
    }

    var hiddenPages = ['cart', 'checkout', 'confirmation', 'tracking'];
    var summary = Store.getCartSummary();

    if (!summary.count || hiddenPages.indexOf(active) !== -1) {
      bar.innerHTML = '';
      document.body.classList.remove('has-cart-bar');
      return;
    }

    document.body.classList.add('has-cart-bar');
    bar.className = 'fixed inset-x-0 bottom-0 z-40 border-t border-emerald-900/10 bg-white/95 px-4 py-3 backdrop-blur md:hidden';
    bar.innerHTML = '' +
      '<a href="' + base + 'cart.html" class="flex items-center justify-between gap-3 rounded-xl bg-brand px-4 py-3 text-white">' +
        '<span class="flex items-center gap-2 text-sm font-semibold">' +
          '<span class="grid h-6 min-w-6 place-items-center rounded-full bg-lime px-1 text-xs font-extrabold text-brand-dark">' + summary.count + '</span>' +
          'View cart' +
        '</span>' +
        '<span class="flex items-center gap-1 text-sm font-extrabold">' + money(summary.grandTotal) +
          '<i data-lucide="arrow-right" class="h-4 w-4"></i>' +
        '</span>' +
      '</a>';
    refreshIcons();
  }

  function updateCartCount() {
    var badge = document.getElementById('cartCount');
    if (!badge) return;
    var count = Store.getCartSummary().count;
    badge.textContent = count > 99 ? '99+' : String(count);
    badge.classList.toggle('hidden', count === 0);
    badge.classList.toggle('grid', count > 0);
  }

  function bindChrome(active, base) {
    var headerSearch = document.getElementById('headerSearch');
    var mobileSearch = document.getElementById('mobileSearch');

    [headerSearch, mobileSearch].forEach(function (form) {
      if (!form) return;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var q = (input && input.value || '').trim();
        window.location.href = base + 'products.html' + (q ? '?q=' + encodeURIComponent(q) : '');
      });
    });

    var locationSelect = document.getElementById('locationSelect');
    if (locationSelect) {
      locationSelect.addEventListener('change', function () {
        Store.setSession({ location: locationSelect.value });
        toast('Delivery location set to ' + locationSelect.value);
      });
    }

    var resetBtn = document.getElementById('resetDemoBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Reset the demo? This clears your cart and any orders you placed.')) return;
        Store.resetDemo();
        toast('Demo data reset');
        setTimeout(function () { window.location.reload(); }, 700);
      });
    }
  }

  /* ---------- init ---------- */

  function initPage(active, options) {
    options = options || {};
    var base = options.base || '';

    var headerMount = document.getElementById('site-header');
    if (headerMount) headerMount.innerHTML = headerHTML(base, active);

    var footerMount = document.getElementById('site-footer');
    if (footerMount) footerMount.innerHTML = footerHTML(base);

    updateCartCount();
    updateCartBar(active, base);
    bindChrome(active, base);
    refreshIcons();

    Store.onChange(function () {
      updateCartCount();
      updateCartBar(active, base);
    });
  }

  window.GS.ui = {
    money: money,
    esc: esc,
    qs: qs,
    toast: toast,
    refreshIcons: refreshIcons,
    formatDateTime: formatDateTime,
    stars: stars,
    discountPercent: discountPercent,
    statusBadge: statusBadge,
    aggregateBadge: aggregateBadge,
    productCard: productCard,
    shopCard: shopCard,
    emptyState: emptyState,
    initPage: initPage,
    TONE_CLASSES: TONE_CLASSES
  };
})();
