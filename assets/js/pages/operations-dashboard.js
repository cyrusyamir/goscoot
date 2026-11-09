/* GoScoot operations overview */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;
  var ops = window.GS.operations;
  ops.mount('overview');

  var headingEl = document.getElementById('opsHeading');
  var root = document.getElementById('opsDashboard');

  var TONES = {
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600',
    green: 'bg-emerald-50 text-emerald-600',
    slate: 'bg-slate-100 text-slate-500',
    rose: 'bg-rose-50 text-rose-600',
    ink: 'bg-ink text-lime'
  };

  function kpi(label, value, sub, icon, tone) {
    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex items-start justify-between gap-2">' +
          '<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">' + ui.esc(label) + '</p>' +
          '<span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg ' + (TONES[tone] || TONES.slate) + '">' +
            '<i data-lucide="' + icon + '" class="h-4 w-4"></i>' +
          '</span>' +
        '</div>' +
        '<p class="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">' + value + '</p>' +
        '<p class="mt-0.5 text-[11px] text-slate-400">' + ui.esc(sub) + '</p>' +
      '</div>';
  }

  function sellerOf(so) {
    return Store.getSeller(so.sellerId) || { name: so.sellerId, emoji: '🏪', location: '' };
  }

  function itemLines(so) {
    return so.items.map(function (item) {
      return '<div class="flex items-start justify-between gap-3 text-xs">' +
        '<span class="text-slate-500"><span class="font-bold text-ink">' + item.qty + '×</span> ' + ui.esc(item.emoji) + ' ' + ui.esc(item.name) + '</span>' +
        '<span class="shrink-0 font-semibold text-ink">' + ui.money(item.price * item.qty) + '</span>' +
      '</div>';
    }).join('');
  }

  function courierName(id) {
    var courier = id ? Store.getCourier(id) : null;
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
        'class="min-w-0 flex-1 rounded-lg border border-emerald-900/10 bg-white px-2.5 py-2 text-xs font-semibold text-ink outline-none focus:border-brand">' +
        '<option value="">Assign partner…</option>' + options +
      '</select>';
  }

  function pickupCard(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var seller = sellerOf(so);
    var action = ops.nextAction(so);
    var hasTask = !!so.pickupTaskId;
    var hasCourier = !!so.courierId;

    return '' +
      '<div class="rounded-2xl border border-amber-200 bg-white p-4">' +
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

        '<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-canvas px-3 py-2">' +
          '<span class="inline-flex items-center gap-1 text-[11px] font-bold text-ink"><i data-lucide="user" class="h-3 w-3 text-brand"></i>' + ui.esc(order.customer.name) + '</span>' +
          '<span class="inline-flex items-center gap-1 text-[11px] text-slate-500"><i data-lucide="phone" class="h-3 w-3"></i>' + ui.esc(order.customer.phone) + '</span>' +
          '<span class="inline-flex min-w-0 items-center gap-1 text-[11px] text-slate-500"><i data-lucide="map-pin" class="h-3 w-3 shrink-0"></i><span class="truncate">' + ui.esc(order.customer.address) + '</span></span>' +
        '</div>' +

        '<div class="mt-3 space-y-1.5 rounded-xl border border-emerald-900/10 p-3">' + itemLines(so) + '</div>' +

        '<div class="mt-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-3">' +
          (hasTask
            ? '<div class="flex flex-wrap items-center gap-2">' +
                '<span class="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-amber-700 ring-1 ring-amber-200">' +
                  '<i data-lucide="clipboard-check" class="h-3 w-3"></i> ' + ui.esc(so.pickupTaskId) +
                '</span>' +
                partnerSelect(entry) +
              '</div>' +
              (hasCourier
                ? '<p class="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700"><i data-lucide="bike" class="h-3 w-3"></i>' + ui.esc(courierName(so.courierId)) + ' assigned for pickup</p>'
                : '<p class="mt-1.5 text-[10px] text-amber-700">Create the task, then assign an available partner.</p>')
            : '<div class="flex flex-wrap items-center justify-between gap-2">' +
                '<p class="text-[11px] font-semibold text-amber-800">Packed and waiting. Create a pickup task to dispatch a partner.</p>' +
                '<button type="button" data-action="create-task" data-order-id="' + ui.esc(order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" ' +
                  'class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-300 transition hover:bg-amber-100">' +
                  '<i data-lucide="clipboard-plus" class="h-3.5 w-3.5"></i> Create pickup task' +
                '</button>' +
              '</div>') +
        '</div>' +

        (action
          ? '<div class="mt-3 flex flex-wrap items-center justify-between gap-2">' +
              '<p class="text-[10px] text-slate-400">' + (hasCourier ? 'Ready for the partner to collect.' : 'Assign a partner to enable pickup.') + '</p>' +
              '<button type="button" data-action="advance" data-order-id="' + ui.esc(order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" data-next="' + action.status + '" ' +
                (hasCourier ? '' : 'disabled ') +
                'class="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition ' +
                (hasCourier ? 'bg-brand text-white hover:bg-brand-dark' : 'cursor-not-allowed bg-slate-100 text-slate-400') + '">' +
                '<i data-lucide="' + action.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(action.label) +
              '</button>' +
            '</div>'
          : '') +
      '</div>';
  }

  function activeCard(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var seller = sellerOf(so);
    var action = ops.nextAction(so);
    var courier = so.courierId ? Store.getCourier(so.courierId) : null;

    return '' +
      '<div class="rounded-2xl border border-violet-200 bg-white p-4">' +
        '<div class="flex flex-wrap items-start justify-between gap-2">' +
          '<div class="min-w-0">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<p class="font-display text-base font-extrabold tracking-tight text-ink">' + ui.esc(order.id) + '</p>' +
              ui.statusBadge(so.status) +
            '</div>' +
            '<p class="mt-0.5 text-[11px] text-slate-400">' + ui.esc(seller.emoji) + ' ' + ui.esc(seller.name) + ' → ' + ui.esc(order.customer.name) + '</p>' +
          '</div>' +
          (courier
            ? '<span class="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200">' +
                '<i data-lucide="bike" class="h-3 w-3"></i> ' + ui.esc(courier.name) +
              '</span>'
            : '') +
        '</div>' +
        '<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-canvas px-3 py-2 text-[11px] text-slate-500">' +
          '<span class="inline-flex items-center gap-1 font-semibold text-ink"><i data-lucide="package" class="h-3 w-3 text-brand"></i>' + ops.countItems(so) + ' items</span>' +
          '<span class="inline-flex min-w-0 items-center gap-1"><i data-lucide="map-pin" class="h-3 w-3 shrink-0"></i><span class="truncate">' + ui.esc(order.customer.address) + '</span></span>' +
          '<span class="font-semibold text-ink">' + ui.money(so.subtotal + so.deliveryFee) + '</span>' +
        '</div>' +
        (action
          ? '<div class="mt-3 flex justify-end">' +
              '<button type="button" data-action="advance" data-order-id="' + ui.esc(order.id) + '" data-seller-id="' + ui.esc(so.sellerId) + '" data-next="' + action.status + '" ' +
                'class="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">' +
                '<i data-lucide="' + action.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(action.label) +
              '</button>' +
            '</div>'
          : '') +
      '</div>';
  }

  function partnerRow(item) {
    var courier = item.courier;
    var current = ops.entries().filter(function (entry) {
      return entry.sellerOrder.courierId === courier.id &&
        entry.sellerOrder.status !== 'delivered' &&
        entry.sellerOrder.status !== 'rejected';
    })[0];

    return '' +
      '<div class="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-emerald-900/5">' +
        '<span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-sm font-extrabold text-brand ring-1 ring-emerald-900/10">' +
          ui.esc(courier.name.charAt(0)) +
        '</span>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="text-xs font-bold text-ink">' + ui.esc(courier.name) + '</p>' +
          '<p class="truncate text-[10px] text-slate-400">' + ui.esc(courier.vehicle) + '</p>' +
        '</div>' +
        '<div class="shrink-0 text-right">' +
          '<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ' + item.meta.tone + '">' +
            '<span class="h-1.5 w-1.5 rounded-full ' + item.meta.dot + '"></span>' + ui.esc(item.meta.label) +
          '</span>' +
          (current ? '<p class="mt-0.5 text-[9px] font-semibold text-slate-400">' + ui.esc(current.order.id) + '</p>' : '') +
        '</div>' +
      '</div>';
  }

  function completedRow(entry) {
    var courier = entry.sellerOrder.courierId ? Store.getCourier(entry.sellerOrder.courierId) : null;
    return '' +
      '<div class="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-emerald-900/5">' +
        '<div class="min-w-0">' +
          '<p class="truncate text-xs font-bold text-ink">' + ui.esc(entry.order.id) + ' · ' + ui.esc(entry.order.customer.name) + '</p>' +
          '<p class="text-[10px] text-slate-400">' + ui.esc(courier ? courier.name : 'Partner') + ' · ' + ui.formatDateTime((entry.sellerOrder.history || []).slice(-1)[0] && (entry.sellerOrder.history || []).slice(-1)[0].at) + '</p>' +
        '</div>' +
        '<span class="text-sm font-extrabold text-brand">' + ui.money(entry.sellerOrder.subtotal) + '</span>' +
      '</div>';
  }

  function renderHeading() {
    headingEl.innerHTML = '' +
      '<div class="overflow-hidden rounded-3xl bg-ink text-white">' +
        '<div class="hero-pattern flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7">' +
          '<div class="flex min-w-0 items-start gap-4">' +
            '<div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/15 md:h-16 md:w-16 md:text-3xl">🛵</div>' +
            '<div class="min-w-0">' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<h1 class="font-display text-2xl font-extrabold tracking-tight md:text-3xl">GoScoot Operations</h1>' +
                '<span class="rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-dark">Dispatch</span>' +
              '</div>' +
              '<p class="mt-1 max-w-xl text-sm text-white/75">Coordinate pickups, assign delivery partners and keep every customer order moving. Seller and customer views update live.</p>' +
              '<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/85">' +
                '<span class="inline-flex items-center gap-1"><span class="h-1.5 w-1.5 rounded-full bg-lime"></span>Shared demo state</span>' +
                '<span class="inline-flex items-center gap-1"><i data-lucide="store" class="h-3.5 w-3.5 text-lime"></i>6 local sellers</span>' +
                '<span class="inline-flex items-center gap-1"><i data-lucide="users" class="h-3.5 w-3.5 text-lime"></i>3 delivery partners</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-wrap gap-2">' +
            '<a href="orders.html" class="inline-flex items-center gap-1.5 rounded-xl bg-lime px-4 py-2.5 text-sm font-bold text-brand-dark transition hover:bg-lime-dark">' +
              '<i data-lucide="clipboard-list" class="h-4 w-4"></i> All fulfilments' +
            '</a>' +
            '<a href="deliveries.html" class="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15">' +
              '<i data-lucide="bike" class="h-4 w-4"></i> Delivery board' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function render() {
    var s = ops.stats();
    var list = ops.entries();
    var pickups = list.filter(function (entry) { return entry.sellerOrder.status === 'ready_for_pickup'; });
    var active = list.filter(function (entry) {
      return ops.ACTIVE_DELIVERY.indexOf(entry.sellerOrder.status) !== -1;
    });
    var completed = list.filter(function (entry) { return entry.sellerOrder.status === 'delivered'; }).slice(0, 4);
    var partners = ops.couriersWithStatus();

    root.innerHTML = '' +
      '<div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">' +
        kpi('Customer orders', s.totalOrders, 'Parent orders in the demo', 'receipt-text', 'slate') +
        kpi('Awaiting seller', s.awaitingConfirmation, 'Not confirmed yet', 'clock', 'amber') +
        kpi('Being prepared', s.preparing, 'Confirmed or packing', 'cooking-pot', 'blue') +
        kpi('Pickup requests', s.pickupRequests, s.unassignedPickups + ' unassigned', 'package-check', 'violet') +
        kpi('Active deliveries', s.activeDeliveries, ui.money(s.activeValue) + ' in transit', 'bike', 'ink') +
        kpi('Completed', s.completed, 'Delivered fulfilments', 'check-check', 'green') +
      '</div>' +

      '<div class="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">' +
        '<div class="space-y-5">' +
          '<section>' +
            '<div class="flex items-end justify-between gap-3">' +
              '<div>' +
                '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Pickup requests</h2>' +
                '<p class="mt-0.5 text-xs text-slate-500">Seller has packed the order. Create a task and assign a partner.</p>' +
              '</div>' +
              '<a href="deliveries.html" class="shrink-0 text-xs font-bold text-brand hover:underline">Delivery board</a>' +
            '</div>' +
            '<div class="mt-3 space-y-3">' +
              (pickups.length
                ? pickups.map(pickupCard).join('')
                : '<div class="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-4 py-8 text-center">' +
                    '<div class="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-light text-brand"><i data-lucide="package-check" class="h-5 w-5"></i></div>' +
                    '<p class="mt-2 text-sm font-bold text-ink">No pickups waiting</p>' +
                    '<p class="mt-0.5 text-xs text-slate-500">When a seller marks an order ready, it appears here.</p>' +
                  '</div>') +
            '</div>' +
          '</section>' +

          '<section>' +
            '<div class="flex items-end justify-between gap-3">' +
              '<div>' +
                '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Active deliveries</h2>' +
                '<p class="mt-0.5 text-xs text-slate-500">Orders with a partner on the road.</p>' +
              '</div>' +
            '</div>' +
            '<div class="mt-3 space-y-3">' +
              (active.length
                ? active.map(activeCard).join('')
                : '<div class="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-4 py-6 text-center text-xs text-slate-500">No deliveries on the road right now. Mark a pickup as collected to start one.</div>') +
            '</div>' +
          '</section>' +
        '</div>' +

        '<aside class="space-y-4">' +
          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<h2 class="font-display text-sm font-extrabold text-ink">Delivery partners</h2>' +
              '<span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">' + partners.filter(function (p) { return p.status === 'available'; }).length + ' available</span>' +
            '</div>' +
            '<div class="mt-3 space-y-2">' + partners.map(partnerRow).join('') + '</div>' +
          '</div>' +

          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<h2 class="font-display text-sm font-extrabold text-ink">Recently completed</h2>' +
            '<div class="mt-3 space-y-2">' +
              (completed.length
                ? completed.map(completedRow).join('')
                : '<p class="rounded-xl bg-brand-light px-3 py-3 text-center text-[11px] font-semibold text-brand">No completed deliveries yet.</p>') +
            '</div>' +
          '</div>' +

          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<h2 class="font-display text-sm font-extrabold text-ink">Dispatch tips</h2>' +
            '<ul class="mt-3 space-y-2.5 text-[11px] leading-relaxed text-slate-500">' +
              '<li class="flex gap-2"><i data-lucide="clipboard-plus" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Create a <strong class="text-ink">pickup task</strong> for a packed order, then assign an available partner.</span></li>' +
              '<li class="flex gap-2"><i data-lucide="bike" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Advance <strong class="text-ink">picked up → out for delivery → delivered</strong> and watch customer tracking update.</span></li>' +
              '<li class="flex gap-2"><i data-lucide="users" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Sameer is already on a delivery. Rahul and Amit are free to assign.</span></li>' +
            '</ul>' +
          '</div>' +
        '</aside>' +
      '</div>';

    ui.refreshIcons();
  }

  root.addEventListener('click', function (event) {
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
    var orderId = select.getAttribute('data-order-id');
    var sellerId = select.getAttribute('data-seller-id');
    var courierId = select.value;
    Store.assignCourier(orderId, sellerId, courierId || null);
    if (courierId) ui.toast('Partner assigned');
  });

  renderHeading();
  Store.onChange(render);
  render();
})();
