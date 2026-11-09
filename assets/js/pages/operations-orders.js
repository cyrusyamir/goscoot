/* GoScoot operations — every seller fulfilment */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;
  var ops = window.GS.operations;
  ops.mount('orders');

  var tabsEl = document.getElementById('opsOrdersTabs');
  var root = document.getElementById('opsOrders');
  var subtitleEl = document.getElementById('opsOrdersSubtitle');

  var state = { tab: 'all' };

  var TABS = [
    { key: 'all', label: 'All' },
    { key: 'awaiting', label: 'Awaiting seller' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'pickup', label: 'Pickup requests' },
    { key: 'transit', label: 'In transit' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' }
  ];

  function matches(tab, status) {
    if (tab === 'all') return true;
    if (tab === 'awaiting') return status === 'placed';
    if (tab === 'preparing') return status === 'confirmed' || status === 'preparing';
    if (tab === 'pickup') return status === 'ready_for_pickup';
    if (tab === 'transit') return status === 'picked_up' || status === 'out_for_delivery';
    if (tab === 'completed') return status === 'delivered';
    if (tab === 'rejected') return status === 'rejected';
    return true;
  }

  function countFor(tab) {
    return ops.entries().filter(function (entry) {
      return matches(tab, entry.sellerOrder.status);
    }).length;
  }

  function renderTabs() {
    tabsEl.innerHTML = TABS.map(function (tab) {
      var count = countFor(tab.key);
      var active = state.tab === tab.key;
      return '<button type="button" data-tab="' + tab.key + '" class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ' +
        (active ? 'bg-brand text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-emerald-900/10 hover:bg-brand-light hover:text-brand') + '">' +
        ui.esc(tab.label) +
        '<span class="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ' +
          (active ? 'bg-white/20 text-white' : 'bg-canvas text-slate-500') + '">' + count + '</span>' +
      '</button>';
    }).join('');
  }

  function sellerOf(so) {
    return Store.getSeller(so.sellerId) || { name: so.sellerId, emoji: '🏪', location: '' };
  }

  function courierLabel(so) {
    var courier = so.courierId ? Store.getCourier(so.courierId) : null;
    return courier ? courier.name : '';
  }

  function partnerSelect(entry) {
    var so = entry.sellerOrder;
    var options = ops.availableCouriers(so).map(function (item) {
      var selected = item.courier.id === so.courierId ? ' selected' : '';
      return '<option value="' + ui.esc(item.courier.id) + '"' + selected + '>' +
        ui.esc(item.courier.name) + ' · ' + ui.esc(item.meta.label) + '</option>';
    }).join('');

    return '' +
      '<select data-courier-select data-order-id="' + ui.esc(entry.order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" ' +
        'class="min-w-0 rounded-lg border border-emerald-900/10 bg-white px-2.5 py-2 text-xs font-semibold text-ink outline-none focus:border-brand">' +
        '<option value="">Assign partner…</option>' + options +
      '</select>';
  }

  function actionRow(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var action = ops.nextAction(so);

    if (so.status === 'ready_for_pickup') {
      return '' +
        '<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-emerald-900/10 pt-3">' +
          '<div class="flex flex-wrap items-center gap-2">' +
            (so.pickupTaskId
              ? '<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-200">' +
                  '<i data-lucide="clipboard-check" class="h-3 w-3"></i> ' + ui.esc(so.pickupTaskId) +
                '</span>' + partnerSelect(entry)
              : '<button type="button" data-action="create-task" data-order-id="' + ui.esc(order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" ' +
                  'class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-300 transition hover:bg-amber-50">' +
                  '<i data-lucide="clipboard-plus" class="h-3.5 w-3.5"></i> Create pickup task' +
                '</button>') +
          '</div>' +
          '<button type="button" data-action="advance" data-order-id="' + ui.esc(order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" data-next="picked_up" ' +
            (so.courierId ? '' : 'disabled ') +
            'class="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ' +
            (so.courierId ? 'bg-brand text-white hover:bg-brand-dark' : 'cursor-not-allowed bg-slate-100 text-slate-400') + '">' +
            '<i data-lucide="package" class="h-3.5 w-3.5"></i> Mark picked up' +
          '</button>' +
        '</div>';
    }

    if (action) {
      return '' +
        '<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-emerald-900/10 pt-3">' +
          '<span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">' +
            '<i data-lucide="bike" class="h-3.5 w-3.5 text-brand"></i> ' + ui.esc(courierLabel(so) || 'Partner assigned') +
          '</span>' +
          '<button type="button" data-action="advance" data-order-id="' + ui.esc(order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" data-next="' + action.status + '" ' +
            'class="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">' +
            '<i data-lucide="' + action.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(action.label) +
          '</button>' +
        '</div>';
    }

    var notes = {
      placed: { icon: 'clock', text: 'Waiting for the seller to accept', tone: 'slate' },
      confirmed: { icon: 'badge-check', text: 'Seller accepted · packing soon', tone: 'blue' },
      preparing: { icon: 'cooking-pot', text: 'Seller is packing this order', tone: 'amber' },
      delivered: { icon: 'check-check', text: 'Delivered to the customer', tone: 'green' },
      rejected: { icon: 'x-circle', text: 'Rejected by the seller', tone: 'rose' }
    };
    var note = notes[so.status] || { icon: 'clock', text: so.status, tone: 'slate' };
    var toneClasses = {
      blue: 'bg-sky-50 text-sky-700 ring-sky-200',
      amber: 'bg-amber-50 text-amber-700 ring-amber-200',
      green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      rose: 'bg-rose-50 text-rose-700 ring-rose-200',
      slate: 'bg-slate-100 text-slate-600 ring-slate-200'
    };

    return '' +
      '<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-emerald-900/10 pt-3">' +
        '<div>' +
          '<p class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal + so.deliveryFee) + '</p>' +
          '<p class="text-[10px] text-slate-400">items + delivery</p>' +
        '</div>' +
        '<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ' + (toneClasses[note.tone] || toneClasses.slate) + '">' +
          '<i data-lucide="' + note.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(note.text) +
        '</span>' +
      '</div>';
  }

  function orderCard(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var seller = sellerOf(so);
    var others = order.sellerOrders.length - 1;

    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex flex-wrap items-start justify-between gap-2">' +
          '<div class="min-w-0">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<p class="font-display text-base font-extrabold tracking-tight text-ink">' + ui.esc(order.id) + '</p>' +
              ui.statusBadge(so.status) +
            '</div>' +
            '<p class="mt-0.5 text-[11px] text-slate-400">' + ui.esc(seller.emoji) + ' ' + ui.esc(seller.name) + ' · ' + ui.esc(seller.location) + '</p>' +
          '</div>' +
          '<div class="text-right">' +
            '<p class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal + so.deliveryFee) + '</p>' +
            '<p class="text-[10px] text-slate-400">items + delivery</p>' +
          '</div>' +
        '</div>' +

        (others > 0
          ? '<p class="mt-2 inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700">' +
              '<i data-lucide="split" class="h-3 w-3"></i> Multi-shop order · ' + others + ' other shop' + (others === 1 ? '' : 's') +
            '</p>'
          : '') +

        '<div class="mt-3 rounded-xl bg-canvas p-3">' +
          '<div class="flex flex-wrap items-center gap-x-3 gap-y-1">' +
            '<p class="text-xs font-extrabold text-ink">' + ui.esc(order.customer.name) + '</p>' +
            '<a href="tel:' + ui.esc(order.customer.phone) + '" class="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline">' +
              '<i data-lucide="phone" class="h-3 w-3"></i>' + ui.esc(order.customer.phone) +
            '</a>' +
            (so.courierId
              ? '<span class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200">' +
                  '<i data-lucide="bike" class="h-3 w-3"></i> ' + ui.esc(courierLabel(so)) +
                '</span>'
              : '') +
          '</div>' +
          '<p class="mt-1 text-[11px] leading-relaxed text-slate-500">' + ui.esc(order.customer.address) + '</p>' +
          (order.customer.landmark ? '<p class="mt-0.5 text-[10px] text-slate-400">Landmark: ' + ui.esc(order.customer.landmark) + '</p>' : '') +
          (order.customer.instructions ? '<p class="mt-1 inline-flex items-start gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"><i data-lucide="message-square" class="mt-0.5 h-3 w-3 shrink-0"></i>' + ui.esc(order.customer.instructions) + '</p>' : '') +
        '</div>' +

        '<div class="mt-3 space-y-1.5 rounded-xl border border-emerald-900/10 p-3">' +
          so.items.map(function (item) {
            return '<div class="flex items-start justify-between gap-3 text-xs">' +
              '<span class="text-slate-500"><span class="font-bold text-ink">' + item.qty + '×</span> ' + ui.esc(item.emoji) + ' ' + ui.esc(item.name) + ' <span class="text-slate-400">(' + ui.esc(item.unit) + ')</span></span>' +
              '<span class="shrink-0 font-semibold text-ink">' + ui.money(item.price * item.qty) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +

        actionRow(entry) +
      '</div>';
  }

  function render() {
    renderTabs();

    var entries = ops.entries().filter(function (entry) {
      return matches(state.tab, entry.sellerOrder.status);
    });

    var s = ops.stats();
    subtitleEl.textContent = entries.length + (entries.length === 1 ? ' fulfilment' : ' fulfilments') +
      ' in this view · ' + s.pickupRequests + ' pickup request' + (s.pickupRequests === 1 ? '' : 's') +
      ' · ' + s.activeDeliveries + ' active deliver' + (s.activeDeliveries === 1 ? 'y' : 'ies');

    if (!entries.length) {
      root.innerHTML = ui.emptyState(
        'clipboard-list',
        'Nothing in this view',
        'No seller fulfilments match this filter. Try another tab.',
        '<button type="button" data-tab="all" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">View all fulfilments</button>'
      );
      ui.refreshIcons();
      return;
    }

    root.innerHTML = entries.map(orderCard).join('');
    ui.refreshIcons();
  }

  tabsEl.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-tab]');
    if (!btn) return;
    state.tab = btn.getAttribute('data-tab');
    render();
  });

  root.addEventListener('click', function (event) {
    var tabBtn = event.target.closest('[data-tab]');
    if (tabBtn) {
      state.tab = tabBtn.getAttribute('data-tab');
      render();
      return;
    }

    var btn = event.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var orderId = btn.getAttribute('data-order-id');
    var sellerId = btn.getAttribute('data-seller-id');

    if (action === 'create-task') {
      Store.createPickupTask(orderId, sellerId);
      ui.toast('Pickup task created');
    } else if (action === 'advance') {
      var next = btn.getAttribute('data-next');
      ops.setStatus(orderId, sellerId, next, 'Delivery updated to ' + (Store.STATUS_META[next] || {}).short);
    }
  });

  root.addEventListener('change', function (event) {
    var select = event.target.closest('[data-courier-select]');
    if (!select) return;
    Store.assignCourier(select.getAttribute('data-order-id'), select.getAttribute('data-seller-id'), select.value || null);
    if (select.value) ui.toast('Partner assigned');
  });

  Store.onChange(render);
  render();
})();
