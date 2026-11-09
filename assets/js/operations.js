/* GoScoot operations demo shell and shared helpers.
 * Loaded only on operations pages, after seed.js, store.js and ui.js.
 */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  var NAV = [
    { key: 'overview', href: 'dashboard.html', label: 'Overview', icon: 'layout-dashboard' },
    { key: 'orders', href: 'orders.html', label: 'Orders', icon: 'clipboard-list' },
    { key: 'deliveries', href: 'deliveries.html', label: 'Deliveries', icon: 'bike' }
  ];

  var ACTIVE_DELIVERY = ['picked_up', 'out_for_delivery'];
  var PICKUP_QUEUE = ['ready_for_pickup'];

  /* ---------- data helpers ---------- */

  function entries() {
    var list = [];
    Store.getOrders().forEach(function (order) {
      order.sellerOrders.forEach(function (sellerOrder) {
        list.push({ order: order, sellerOrder: sellerOrder });
      });
    });
    return list.sort(function (a, b) {
      return new Date(b.order.createdAt) - new Date(a.order.createdAt);
    });
  }

  function entryKey(entry) {
    return entry.order.id + '::' + entry.sellerOrder.sellerId;
  }

  function countItems(sellerOrder) {
    return sellerOrder.items.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function stats() {
    var list = entries();
    var result = {
      totalOrders: Store.getOrders().length,
      awaitingConfirmation: 0,
      preparing: 0,
      pickupRequests: 0,
      activeDeliveries: 0,
      completed: 0,
      rejected: 0,
      unassignedPickups: 0,
      assignedPickups: 0,
      activeValue: 0
    };

    list.forEach(function (entry) {
      var so = entry.sellerOrder;
      if (so.status === 'placed') {
        result.awaitingConfirmation++;
      } else if (so.status === 'confirmed' || so.status === 'preparing') {
        result.preparing++;
      } else if (so.status === 'ready_for_pickup') {
        result.pickupRequests++;
        if (so.courierId) result.assignedPickups++;
        else result.unassignedPickups++;
      } else if (so.status === 'picked_up' || so.status === 'out_for_delivery') {
        result.activeDeliveries++;
        result.activeValue += so.subtotal + so.deliveryFee;
      } else if (so.status === 'delivered') {
        result.completed++;
      } else if (so.status === 'rejected') {
        result.rejected++;
      }
    });

    return result;
  }

  function courierStatus(courier) {
    var assigned = entries().filter(function (entry) {
      return entry.sellerOrder.courierId === courier.id &&
        entry.sellerOrder.status !== 'delivered' &&
        entry.sellerOrder.status !== 'rejected';
    });

    if (assigned.some(function (entry) {
      return ACTIVE_DELIVERY.indexOf(entry.sellerOrder.status) !== -1;
    })) {
      return 'on_delivery';
    }
    if (assigned.length) return 'assigned';
    return courier.status || 'available';
  }

  var COURIER_META = {
    available: { label: 'Available', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
    assigned: { label: 'Assigned', tone: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
    on_delivery: { label: 'On delivery', tone: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' }
  };

  function courierMeta(status) {
    return COURIER_META[status] || COURIER_META.available;
  }

  function couriersWithStatus() {
    return Store.getCouriers().map(function (courier) {
      var status = courierStatus(courier);
      return { courier: courier, status: status, meta: courierMeta(status) };
    });
  }

  function availableCouriers(sellerOrder) {
    return couriersWithStatus().filter(function (entry) {
      return entry.status === 'available' || entry.courier.id === sellerOrder.courierId;
    });
  }

  function nextAction(sellerOrder) {
    if (sellerOrder.status === 'ready_for_pickup') {
      return { status: 'picked_up', label: 'Mark picked up', icon: 'package', needsCourier: true };
    }
    if (sellerOrder.status === 'picked_up') {
      return { status: 'out_for_delivery', label: 'Start delivery', icon: 'bike', needsCourier: false };
    }
    if (sellerOrder.status === 'out_for_delivery') {
      return { status: 'delivered', label: 'Complete delivery', icon: 'check-check', needsCourier: false };
    }
    return null;
  }

  function setStatus(orderId, sellerId, status, message) {
    var updated = Store.updateSellerOrderStatus(orderId, sellerId, status);
    if (updated) ui.toast(message || 'Delivery updated');
    return updated;
  }

  /* ---------- header / footer ---------- */

  function headerHTML(active) {
    var pickupCount = stats().pickupRequests;

    function navLink(item) {
      var isActive = active === item.key;
      var badge = item.key === 'orders'
        ? '<span id="opsPickupBadge" class="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-white' +
            (pickupCount ? '' : ' hidden') + '">' + pickupCount + '</span>'
        : '';
      return '<a href="' + item.href + '" class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition ' +
        (isActive ? 'bg-brand-light text-brand' : 'text-slate-600 hover:bg-brand-light hover:text-brand') + '">' +
        '<i data-lucide="' + item.icon + '" class="h-4 w-4"></i>' + item.label + badge +
      '</a>';
    }

    return '' +
      '<header class="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#f8faf6]/95 backdrop-blur">' +
        '<div class="mx-auto max-w-7xl px-4">' +
          '<div class="flex h-16 items-center gap-3">' +
            '<a href="dashboard.html" class="flex shrink-0 items-center gap-2">' +
              '<span class="grid h-9 w-9 place-items-center rounded-xl bg-brand text-lime shadow-sm">' +
                '<i data-lucide="bike" class="h-5 w-5"></i>' +
              '</span>' +
              '<span class="font-display text-xl font-extrabold tracking-tight text-brand">GoScoot</span>' +
              '<span class="rounded-full bg-ink px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-lime">Operations</span>' +
            '</a>' +

            '<nav class="ml-4 hidden items-center gap-1 lg:flex">' +
              NAV.map(navLink).join('') +
            '</nav>' +

            '<div class="ml-auto flex items-center gap-2">' +
              '<span class="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">' +
                '<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Live demo' +
              '</span>' +
              '<a href="../seller/dashboard.html" class="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand md:inline-flex">' +
                '<i data-lucide="store" class="h-3.5 w-3.5"></i> Seller' +
              '</a>' +
              '<a href="../index.html" class="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-500 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand" aria-label="Back to customer store">' +
                '<i data-lucide="shopping-bag" class="h-4 w-4"></i>' +
              '</a>' +
            '</div>' +
          '</div>' +

          '<div class="no-scrollbar flex gap-1 overflow-x-auto pb-3 lg:hidden">' + NAV.map(navLink).join('') + '</div>' +
        '</div>' +
      '</header>';
  }

  function footerHTML() {
    return '' +
      '<footer class="mt-16 border-t border-emerald-900/10 bg-white">' +
        '<div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">' +
          '<div>' +
            '<p class="text-sm font-extrabold text-ink">GoScoot Operations demo</p>' +
            '<p class="mt-0.5 text-xs text-slate-500">Pickup tasks, partner assignment and delivery updates sync across all three dashboards.</p>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<button type="button" id="opsResetBtn" class="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-500 ring-1 ring-emerald-900/10 transition hover:bg-rose-50 hover:text-rose-600">Reset demo data</button>' +
            '<a href="../seller/dashboard.html" class="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand">Seller dashboard</a>' +
            '<a href="../index.html" class="rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">Customer store</a>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ---------- bindings ---------- */

  function cleanReload() {
    window.location.href = window.location.href.split('?')[0].split('#')[0];
  }

  function updatePickupBadge() {
    var badge = document.getElementById('opsPickupBadge');
    if (!badge) return;
    var count = stats().pickupRequests;
    badge.textContent = count;
    badge.classList.toggle('hidden', count === 0);
  }

  function bind() {
    var resetBtn = document.getElementById('opsResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Reset the demo? This restores seed products and orders.')) return;
        Store.resetDemo();
        ui.toast('Demo data reset');
        setTimeout(cleanReload, 600);
      });
    }
    updatePickupBadge();
  }

  /* ---------- mount ---------- */

  function mount(active) {
    var headerMount = document.getElementById('ops-header');
    if (headerMount) headerMount.innerHTML = headerHTML(active);

    var footerMount = document.getElementById('ops-footer');
    if (footerMount) footerMount.innerHTML = footerHTML();

    bind();
    ui.refreshIcons();

    Store.onChange(updatePickupBadge);

    return { stats: stats() };
  }

  window.GS = window.GS || {};
  window.GS.operations = {
    mount: mount,
    entries: entries,
    entryKey: entryKey,
    countItems: countItems,
    stats: stats,
    couriersWithStatus: couriersWithStatus,
    courierStatus: courierStatus,
    courierMeta: courierMeta,
    availableCouriers: availableCouriers,
    nextAction: nextAction,
    setStatus: setStatus,
    ACTIVE_DELIVERY: ACTIVE_DELIVERY,
    PICKUP_QUEUE: PICKUP_QUEUE
  };
})();
