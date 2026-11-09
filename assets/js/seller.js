/* GoScoot seller demo shell and shared helpers.
 * Loaded only on seller pages, after seed.js, store.js and ui.js.
 */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  var NAV = [
    { key: 'overview', href: 'dashboard.html', label: 'Overview', icon: 'layout-dashboard' },
    { key: 'orders', href: 'orders.html', label: 'Orders', icon: 'receipt-text' },
    { key: 'products', href: 'products.html', label: 'Products', icon: 'package' }
  ];

  var ACTIVE_STATUSES = ['placed', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'out_for_delivery'];

  /* ---------- seller context ---------- */

  function currentSellerId() {
    var queryId = ui.qs('seller');
    var session = Store.getSession();
    var id = queryId || session.sellerId;

    if (!id || !Store.getSeller(id)) {
      id = (Store.getSellers()[0] || {}).id || 'seller_001';
    }
    if (session.sellerId !== id || session.role !== 'seller') {
      Store.setSession({ sellerId: id, role: 'seller' });
    }
    return id;
  }

  function sellerOffers(sellerId) {
    return Store.getProducts().map(function (product) {
      var offer = product.offers.find(function (o) { return o.sellerId === sellerId; });
      return offer ? { product: product, offer: offer } : null;
    }).filter(Boolean);
  }

  function ordersFor(sellerId) {
    return Store.getOrders().map(function (order) {
      var sellerOrder = order.sellerOrders.find(function (so) { return so.sellerId === sellerId; });
      return sellerOrder ? { order: order, sellerOrder: sellerOrder } : null;
    }).filter(Boolean).sort(function (a, b) {
      return new Date(b.order.createdAt) - new Date(a.order.createdAt);
    });
  }

  function countItems(sellerOrder) {
    return sellerOrder.items.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function stats(sellerId) {
    var entries = ordersFor(sellerId);
    var result = {
      totalOrders: entries.length,
      newOrders: 0,
      preparing: 0,
      ready: 0,
      inTransit: 0,
      delivered: 0,
      rejected: 0,
      revenue: 0,
      itemsToPack: 0,
      active: 0
    };

    entries.forEach(function (entry) {
      var status = entry.sellerOrder.status;
      if (status === 'placed') {
        result.newOrders++;
        result.itemsToPack += countItems(entry.sellerOrder);
      } else if (status === 'confirmed' || status === 'preparing') {
        result.preparing++;
        result.itemsToPack += countItems(entry.sellerOrder);
      } else if (status === 'ready_for_pickup') {
        result.ready++;
      } else if (status === 'picked_up' || status === 'out_for_delivery') {
        result.inTransit++;
      } else if (status === 'delivered') {
        result.delivered++;
        result.revenue += entry.sellerOrder.subtotal;
      } else if (status === 'rejected') {
        result.rejected++;
      }
    });

    result.active = result.newOrders + result.preparing + result.ready + result.inTransit;

    var offers = sellerOffers(sellerId);
    result.products = offers.length;
    result.lowStock = offers.filter(function (entry) {
      return entry.offer.available && entry.offer.stock > 0 && entry.offer.stock <= 5;
    }).length;
    result.outOfStock = offers.filter(function (entry) {
      return !entry.offer.available || entry.offer.stock <= 0;
    }).length;

    return result;
  }

  function activeCount(sellerId) {
    return ordersFor(sellerId).filter(function (entry) {
      return ACTIVE_STATUSES.indexOf(entry.sellerOrder.status) !== -1;
    }).length;
  }

  function nextAction(status) {
    if (status === 'placed') {
      return { status: 'confirmed', label: 'Accept order', icon: 'check' };
    }
    if (status === 'confirmed') {
      return { status: 'preparing', label: 'Start preparing', icon: 'cooking-pot' };
    }
    if (status === 'preparing') {
      return { status: 'ready_for_pickup', label: 'Mark ready for pickup', icon: 'package-check' };
    }
    return null;
  }

  function setStatus(orderId, sellerId, status, message) {
    var updated = Store.updateSellerOrderStatus(orderId, sellerId, status);
    if (updated) ui.toast(message || 'Order updated');
    return updated;
  }

  /* ---------- header / footer ---------- */

  function headerHTML(active, seller, sellerId) {
    var orderCount = activeCount(sellerId);

    function navLink(item) {
      var isActive = active === item.key;
      var badge = item.key === 'orders'
        ? '<span id="sellerOrderBadge" class="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-white' +
            (orderCount ? '' : ' hidden') + '">' + orderCount + '</span>'
        : '';
      return '<a href="' + item.href + '" class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ' +
        (isActive ? 'bg-brand-light text-brand' : 'text-slate-600 hover:bg-brand-light hover:text-brand') + '">' +
        '<i data-lucide="' + item.icon + '" class="h-4 w-4"></i>' + item.label + badge +
      '</a>';
    }

    var options = Store.getSellers().map(function (s) {
      return '<option value="' + ui.esc(s.id) + '"' + (s.id === sellerId ? ' selected' : '') + '>' +
        ui.esc(s.name) + '</option>';
    }).join('');

    return '' +
      '<header class="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#f8faf6]/95 backdrop-blur">' +
        '<div class="mx-auto max-w-7xl px-4">' +
          '<div class="flex h-16 items-center gap-3">' +
            '<a href="dashboard.html" class="flex shrink-0 items-center gap-2">' +
              '<span class="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lime shadow-sm">' +
                '<i data-lucide="bike" class="h-5 w-5"></i>' +
              '</span>' +
              '<span class="font-display text-xl font-extrabold tracking-tight text-brand">GoScoot</span>' +
              '<span class="rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-dark">Seller</span>' +
            '</a>' +

            '<nav class="ml-4 hidden items-center gap-1 lg:flex">' +
              NAV.map(navLink).join('') +
            '</nav>' +

            '<div class="ml-auto flex items-center gap-2">' +
              '<label class="hidden items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:flex">' +
                '<i data-lucide="store" class="h-3.5 w-3.5 text-brand"></i>' +
                '<span class="text-slate-400">Shop</span>' +
                '<select id="sellerSelect" class="max-w-[10rem] cursor-pointer bg-transparent font-semibold text-ink outline-none">' + options + '</select>' +
              '</label>' +
              '<a href="../shop.html?id=' + encodeURIComponent(sellerId) + '" class="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-brand ring-1 ring-emerald-900/10 transition hover:bg-brand-light md:inline-flex">' +
                '<i data-lucide="external-link" class="h-3.5 w-3.5"></i> Storefront' +
              '</a>' +
              '<a href="../index.html" class="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand" aria-label="Back to customer store">' +
                '<i data-lucide="shopping-bag" class="h-4 w-4"></i>' +
              '</a>' +
            '</div>' +
          '</div>' +

          '<div class="flex flex-col gap-2 pb-3 lg:hidden">' +
            '<label class="flex items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:hidden">' +
              '<i data-lucide="store" class="h-3.5 w-3.5 text-brand"></i>' +
              '<span class="text-slate-400">Shop</span>' +
              '<select id="sellerSelectMobile" class="min-w-0 flex-1 cursor-pointer bg-transparent font-semibold text-ink outline-none">' + options + '</select>' +
            '</label>' +
            '<div class="no-scrollbar flex gap-1 overflow-x-auto">' + NAV.map(navLink).join('') + '</div>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  function footerHTML(seller) {
    return '' +
      '<footer class="mt-16 border-t border-emerald-900/10 bg-white">' +
        '<div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">' +
          '<div>' +
            '<p class="text-sm font-extrabold text-ink">GoScoot Seller demo · ' + ui.esc(seller.name) + '</p>' +
            '<p class="mt-0.5 text-xs text-slate-500">Orders, stock and prices are stored in this browser only. No login or real payouts.</p>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<button type="button" id="sellerResetBtn" class="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-500 ring-1 ring-emerald-900/10 transition hover:bg-rose-50 hover:text-rose-600">Reset demo data</button>' +
            '<a href="../operations/dashboard.html" class="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand">Operations</a>' +
            '<a href="../index.html" class="rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">Customer store</a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- bindings ---------- */

  function cleanReload() {
    window.location.href = window.location.href.split('?')[0].split('#')[0];
  }

  function bind(active, sellerId) {
    [document.getElementById('sellerSelect'), document.getElementById('sellerSelectMobile')].forEach(function (select) {
      if (!select) return;
      select.addEventListener('change', function () {
        Store.setSession({ sellerId: select.value, role: 'seller' });
        cleanReload();
      });
    });

    var resetBtn = document.getElementById('sellerResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Reset the demo? This restores seed products and orders.')) return;
        Store.resetDemo();
        ui.toast('Demo data reset');
        setTimeout(cleanReload, 600);
      });
    }

    updateOrderBadge(sellerId);
  }

  function updateOrderBadge(sellerId) {
    var badge = document.getElementById('sellerOrderBadge');
    if (!badge) return;
    var count = activeCount(sellerId);
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  /* ---------- mount ---------- */

  function mount(active) {
    var sellerId = currentSellerId();
    var seller = Store.getSeller(sellerId);

    var headerMount = document.getElementById('seller-header');
    if (headerMount) headerMount.innerHTML = headerHTML(active, seller, sellerId);

    var footerMount = document.getElementById('seller-footer');
    if (footerMount) footerMount.innerHTML = footerHTML(seller);

    bind(active, sellerId);
    ui.refreshIcons();

    Store.onChange(function () {
      updateOrderBadge(sellerId);
    });

    return { sellerId: sellerId, seller: seller };
  }

  window.GS = window.GS || {};
  window.GS.seller = {
    mount: mount,
    ordersFor: ordersFor,
    sellerOffers: sellerOffers,
    stats: stats,
    activeCount: activeCount,
    countItems: countItems,
    nextAction: nextAction,
    setStatus: setStatus
  };
})();
