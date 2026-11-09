/* GoScoot operations — delivery board */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;
  var ops = window.GS.operations;
  ops.mount('deliveries');

  var root = document.getElementById('opsDeliveries');
  var subtitleEl = document.getElementById('opsDeliveriesSubtitle');

  function sellerOf(so) {
    return Store.getSeller(so.sellerId) || { name: so.sellerId, emoji: '🏪', location: '' };
  }

  function courierOf(so) {
    return so.courierId ? Store.getCourier(so.courierId) : null;
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

  function partnerCard(item) {
    var courier = item.courier;
    var current = ops.entries().filter(function (entry) {
      return entry.sellerOrder.courierId === courier.id &&
        entry.sellerOrder.status !== 'delivered' &&
        entry.sellerOrder.status !== 'rejected';
    });
    var active = current.filter(function (entry) {
      return ops.ACTIVE_DELIVERY.indexOf(entry.sellerOrder.status) !== -1;
    }).length;

    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex items-start justify-between gap-2">' +
          '<div class="flex min-w-0 items-center gap-3">' +
            '<span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light font-display text-base font-extrabold text-brand">' +
              ui.esc(courier.name.charAt(0)) +
            '</span>' +
            '<div class="min-w-0">' +
              '<p class="truncate text-sm font-extrabold text-ink">' + ui.esc(courier.name) + '</p>' +
              '<p class="truncate text-[11px] text-slate-400">' + ui.esc(courier.vehicle) + '</p>' +
            '</div>' +
          '</div>' +
          '<span class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ' + item.meta.tone + '">' +
            '<span class="h-1.5 w-1.5 rounded-full ' + item.meta.dot + '"></span>' + ui.esc(item.meta.label) +
          '</span>' +
        '</div>' +
        '<div class="mt-3 grid grid-cols-2 gap-2 text-center">' +
          '<div class="rounded-lg bg-canvas px-2 py-1.5">' +
            '<p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">Open tasks</p>' +
            '<p class="text-sm font-extrabold text-ink">' + current.length + '</p>' +
          '</div>' +
          '<div class="rounded-lg bg-canvas px-2 py-1.5">' +
            '<p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">On the road</p>' +
            '<p class="text-sm font-extrabold ' + (active ? 'text-violet-600' : 'text-ink') + '">' + active + '</p>' +
          '</div>' +
        '</div>' +
        (current.length
          ? '<p class="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500"><i data-lucide="package" class="h-3 w-3 text-brand"></i>' +
              current.map(function (entry) { return ui.esc(entry.order.id); }).join(', ') + '</p>'
          : '<p class="mt-2 text-[10px] font-semibold text-emerald-600">Free for a new pickup</p>') +
      '</div>';
  }

  function pickupRow(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var seller = sellerOf(so);

    return '' +
      '<div class="rounded-2xl border border-amber-200 bg-white p-4">' +
        '<div class="flex flex-wrap items-start justify-between gap-2">' +
          '<div class="min-w-0">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<p class="text-sm font-extrabold text-ink">' + ui.esc(order.id) + '</p>' +
              ui.statusBadge(so.status) +
            '</div>' +
            '<p class="mt-0.5 text-[11px] text-slate-400">' + ui.esc(seller.emoji) + ' ' + ui.esc(seller.name) + ' → ' + ui.esc(order.customer.name) + '</p>' +
          '</div>' +
          '<span class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal + so.deliveryFee) + '</span>' +
        '</div>' +
        '<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-canvas px-3 py-2 text-[11px] text-slate-500">' +
          '<span class="inline-flex items-center gap-1 font-semibold text-ink"><i data-lucide="package" class="h-3 w-3 text-brand"></i>' + ops.countItems(so) + ' items</span>' +
          '<span class="inline-flex min-w-0 items-center gap-1"><i data-lucide="map-pin" class="h-3 w-3 shrink-0"></i><span class="truncate">' + ui.esc(order.customer.address) + '</span></span>' +
        '</div>' +
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
        '</div>' +
      '</div>';
  }

  function deliveryCard(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var seller = sellerOf(so);
    var courier = courierOf(so);
    var action = ops.nextAction(so);
    var stepIndex = Store.statusIndex(so.status);
    var pct = Math.round(((stepIndex + 1) / Store.STATUS_FLOW.length) * 100);

    return '' +
      '<div class="rounded-2xl border border-violet-200 bg-white p-4">' +
        '<div class="flex flex-wrap items-start justify-between gap-2">' +
          '<div class="min-w-0">' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<p class="text-sm font-extrabold text-ink">' + ui.esc(order.id) + '</p>' +
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

        '<div class="mt-3">' +
          '<div class="flex items-center justify-between text-[10px] font-bold text-slate-400">' +
            '<span>' + ui.esc(Store.STATUS_META[so.status].label) + '</span>' +
            '<span>' + (stepIndex + 1) + ' of ' + Store.STATUS_FLOW.length + '</span>' +
          '</div>' +
          '<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-violet-100">' +
            '<div class="h-1.5 rounded-full bg-violet-500" style="width:' + pct + '%"></div>' +
          '</div>' +
        '</div>' +

        '<div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-canvas px-3 py-2 text-[11px] text-slate-500">' +
          '<span class="inline-flex items-center gap-1 font-semibold text-ink"><i data-lucide="package" class="h-3 w-3 text-brand"></i>' + ops.countItems(so) + ' items</span>' +
          '<span class="inline-flex items-center gap-1"><i data-lucide="phone" class="h-3 w-3"></i>' + ui.esc(order.customer.phone) + '</span>' +
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

  function completedRow(entry) {
    var so = entry.sellerOrder;
    var seller = sellerOf(so);
    var courier = courierOf(so);
    var deliveredAt = (so.history || []).slice(-1)[0];

    return '' +
      '<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-emerald-900/5">' +
        '<div class="min-w-0">' +
          '<p class="truncate text-xs font-bold text-ink">' + ui.esc(entry.order.id) + ' · ' + ui.esc(entry.order.customer.name) + '</p>' +
          '<p class="text-[10px] text-slate-400">' + ui.esc(seller.name) + ' · ' + ui.esc(courier ? courier.name : 'Partner') + ' · ' + ui.formatDateTime(deliveredAt && deliveredAt.at) + '</p>' +
        '</div>' +
        '<div class="text-right">' +
          '<p class="text-sm font-extrabold text-brand">' + ui.money(so.subtotal) + '</p>' +
          '<p class="text-[10px] text-slate-400">' + ops.countItems(so) + ' items</p>' +
        '</div>' +
      '</div>';
  }

  function section(title, sub, body, count) {
    return '' +
      '<section class="rounded-2xl border border-emerald-900/10 bg-white p-4 md:p-5">' +
        '<div class="flex flex-wrap items-end justify-between gap-2">' +
          '<div>' +
            '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">' + ui.esc(title) + '</h2>' +
            '<p class="mt-0.5 text-xs text-slate-500">' + ui.esc(sub) + '</p>' +
          '</div>' +
          (count != null
            ? '<span class="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-extrabold text-slate-500 ring-1 ring-emerald-900/5">' + count + '</span>'
            : '') +
        '</div>' +
        '<div class="mt-3 space-y-3">' + body + '</div>' +
      '</section>';
  }

  function empty(text) {
    return '<div class="rounded-xl border border-dashed border-emerald-900/15 bg-canvas/60 px-4 py-6 text-center text-xs text-slate-500">' + ui.esc(text) + '</div>';
  }

  function render() {
    var s = ops.stats();
    var list = ops.entries();
    var partners = ops.couriersWithStatus();
    var pickups = list.filter(function (entry) { return entry.sellerOrder.status === 'ready_for_pickup'; });
    var active = list.filter(function (entry) { return ops.ACTIVE_DELIVERY.indexOf(entry.sellerOrder.status) !== -1; });
    var completed = list.filter(function (entry) { return entry.sellerOrder.status === 'delivered'; });

    subtitleEl.textContent = pickups.length + ' pickup request' + (pickups.length === 1 ? '' : 's') +
      ' · ' + active.length + ' active deliver' + (active.length === 1 ? 'y' : 'ies') +
      ' · ' + s.completed + ' completed';

    root.innerHTML = '' +
      '<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">' + partners.map(partnerCard).join('') + '</div>' +

      '<div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">' +
        '<div class="space-y-5">' +
          section(
            'Pickup requests',
            'Packed orders waiting for a partner.',
            pickups.length ? pickups.map(pickupRow).join('') : empty('No packed orders waiting right now.'),
            pickups.length
          ) +
          section(
            'Active deliveries',
            'Partners currently carrying GoScoot orders.',
            active.length ? active.map(deliveryCard).join('') : empty('No deliveries on the road. Mark a pickup as collected to start one.'),
            active.length
          ) +
        '</div>' +

        '<aside class="space-y-5">' +
          section(
            'Completed deliveries',
            'Delivered fulfilments across all shops.',
            completed.length ? completed.map(completedRow).join('') : empty('No completed deliveries yet.'),
            completed.length
          ) +
          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<h2 class="font-display text-sm font-extrabold text-ink">How the demo works</h2>' +
            '<ul class="mt-3 space-y-2.5 text-[11px] leading-relaxed text-slate-500">' +
              '<li class="flex gap-2"><i data-lucide="store" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Sellers accept and pack orders in the seller dashboard.</span></li>' +
              '<li class="flex gap-2"><i data-lucide="clipboard-plus" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Operations creates a pickup task and assigns Rahul, Amit or Sameer.</span></li>' +
              '<li class="flex gap-2"><i data-lucide="check-check" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Each step updates customer tracking immediately — no refresh needed in the same tab.</span></li>' +
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
    Store.assignCourier(select.getAttribute('data-order-id'), select.getAttribute('data-seller-id'), select.value || null);
    if (select.value) ui.toast('Partner assigned');
  });

  Store.onChange(render);
  render();
})();
