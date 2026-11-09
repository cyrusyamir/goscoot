/* Order tracking — per-seller fulfilment timelines */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('tracking');

  var root = document.getElementById('trackingRoot');
  var switcher = document.getElementById('orderSwitcher');
  var switcherWrap = document.getElementById('orderSwitcherWrap');

  var requestedId = ui.qs('id');
  var orders = Store.getOrders();
  var activeId = requestedId || (orders[0] && orders[0].id);

  if (!activeId || !Store.getOrder(activeId)) {
    root.innerHTML = ui.emptyState(
      'package-search',
      'No order to track',
      'Place an order first, or open one of the demo orders from the footer reset. Your tracking will appear here.',
      '<a href="products.html" class="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">Start shopping</a>'
    );
    ui.refreshIcons();
    return;
  }

  function setupSwitcher() {
    var list = Store.getOrders();
    if (!switcher || !switcherWrap || list.length < 2) return;
    switcherWrap.classList.remove('hidden');
    switcherWrap.classList.add('flex');
    switcher.innerHTML = list.map(function (o) {
      return '<option value="' + ui.esc(o.id) + '"' + (o.id === activeId ? ' selected' : '') + '>' +
        ui.esc(o.id) + ' · ' + ui.esc(o.customer.name.split(' ')[0]) +
      '</option>';
    }).join('');
  }

  if (switcher) {
    switcher.addEventListener('change', function () {
      window.location.href = 'tracking.html?id=' + encodeURIComponent(switcher.value);
    });
  }

  function timeline(so) {
    if (so.status === 'rejected') {
      return '<div class="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-600">' +
        'This shop rejected the order. In a full build, GoScoot support would help you re-order or refund.' +
      '</div>';
    }

    var current = Store.statusIndex(so.status);
    return '<div class="mt-4">' +
      Store.STATUS_FLOW.map(function (status, index) {
        var meta = Store.STATUS_META[status];
        var isDone = index < current || (index === current && status === 'delivered');
        var isCurrent = index === current && status !== 'delivered';
        var history = (so.history || []).filter(function (h) { return h.status === status; })[0];
        var stateClass = isDone ? 'is-done' : isCurrent ? 'is-current' : '';
        var icon = isDone ? 'check' : meta.icon;
        var time = history ? ui.formatDateTime(history.at) : (isDone ? 'Completed' : isCurrent ? 'In progress' : 'Pending');

        return '<div class="timeline-step ' + stateClass + '">' +
          '<div class="timeline-dot"><i data-lucide="' + icon + '" class="h-3 w-3"></i></div>' +
          '<p class="timeline-label text-sm font-bold ' + (isDone || isCurrent ? 'text-ink' : 'text-slate-400') + '">' + ui.esc(meta.label) + '</p>' +
          '<p class="text-[11px] ' + (isCurrent ? 'font-semibold text-brand' : 'text-slate-400') + '">' + ui.esc(time) + '</p>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function sellerOrderCard(so) {
    var seller = Store.getSeller(so.sellerId);
    if (!seller) return '';

    var courier = so.courierId ? Store.getCourier(so.courierId) : null;
    var showOpsNote = so.status === 'ready_for_pickup' ||
      so.status === 'picked_up' ||
      so.status === 'out_for_delivery';

    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-5">' +
        '<div class="flex items-start justify-between gap-3">' +
          '<div class="flex min-w-0 items-center gap-3">' +
            '<div class="emoji-tile h-11 w-11 shrink-0 text-xl">' + ui.esc(seller.emoji) + '</div>' +
            '<div class="min-w-0">' +
              '<p class="truncate text-sm font-extrabold text-ink">' + ui.esc(seller.name) + '</p>' +
              '<p class="text-[11px] text-slate-500">' + so.items.length + (so.items.length === 1 ? ' item' : ' items') + ' · ' + ui.money(so.subtotal) + ' · ' + ui.esc(seller.location) + '</p>' +
            '</div>' +
          '</div>' +
          ui.statusBadge(so.status) +
        '</div>' +

        '<div class="mt-3 space-y-1 rounded-xl bg-canvas p-3">' +
          so.items.map(function (item) {
            return '<div class="flex items-start justify-between gap-3 text-xs">' +
              '<span class="text-slate-500"><span class="font-bold text-ink">' + item.qty + '×</span> ' + ui.esc(item.emoji) + ' ' + ui.esc(item.name) + '</span>' +
              '<span class="shrink-0 font-semibold text-ink">' + ui.money(item.price * item.qty) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +

        timeline(so) +

        (showOpsNote
          ? '<div class="mt-4 rounded-xl border border-dashed border-brand/30 bg-brand-light/60 p-3">' +
              '<p class="text-[10px] font-bold uppercase tracking-wider text-brand">GoScoot operations</p>' +
              '<p class="mt-0.5 inline-flex items-center gap-1.5 text-[11px] leading-relaxed text-brand/80">' +
                (courier
                  ? '<i data-lucide="bike" class="h-3.5 w-3.5 shrink-0"></i> Delivery partner: <strong class="font-bold">' + ui.esc(courier.name) + '</strong>'
                  : '<i data-lucide="clock" class="h-3.5 w-3.5 shrink-0"></i> Waiting for GoScoot to assign a delivery partner.') +
              '</p>' +
              '<a href="operations/deliveries.html" class="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">' +
                '<i data-lucide="external-link" class="h-3.5 w-3.5"></i> Open operations board' +
              '</a>' +
            '</div>'
          : '') +
      '</div>';
  }

  function render() {
    var order = Store.getOrder(activeId);
    if (!order) {
      root.innerHTML = ui.emptyState('package-x', 'Order not found', 'This order is no longer available in this browser.', '');
      ui.refreshIcons();
      return;
    }

    var agg = Store.aggregateStatus(order);
    var stepIndex = agg.key === 'delivered'
      ? Store.STATUS_FLOW.length - 1
      : (agg.step != null ? agg.step : Math.max(0, Store.statusIndex(agg.key)));
    var pct = Math.round(((stepIndex + 1) / Store.STATUS_FLOW.length) * 100);

    var sellers = order.sellerOrders.map(function (so) { return Store.getSeller(so.sellerId); }).filter(Boolean);
    var etaMin = sellers.length ? Math.min.apply(null, sellers.map(function (s) { return s.etaMin; })) : 20;
    var etaMax = sellers.length ? Math.max.apply(null, sellers.map(function (s) { return s.etaMax; })) : 40;

    root.innerHTML = '' +
      '<div class="rounded-3xl border border-emerald-900/10 bg-white p-5 md:p-6">' +
        '<div class="flex flex-wrap items-start justify-between gap-4">' +
          '<div>' +
            '<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order</p>' +
            '<div class="mt-0.5 flex flex-wrap items-center gap-2">' +
              '<h2 class="font-display text-2xl font-extrabold tracking-tight text-ink">' + ui.esc(order.id) + '</h2>' +
              ui.aggregateBadge(order) +
            '</div>' +
            '<p class="mt-1 text-xs text-slate-500">Placed ' + ui.formatDateTime(order.createdAt) + ' · ' +
              order.sellerOrders.length + (order.sellerOrders.length === 1 ? ' shop' : ' shops') + ' · ' +
              ui.money(order.totals.grandTotal) + '</p>' +
          '</div>' +
          '<div class="rounded-2xl bg-brand-light px-4 py-3 text-right">' +
            '<p class="text-[10px] font-bold uppercase tracking-wider text-brand/70">Delivery by GoScoot</p>' +
            '<p class="font-display text-lg font-extrabold text-brand">' + etaMin + '–' + etaMax + ' min</p>' +
            '<p class="text-[10px] text-brand/70">from the first shop</p>' +
          '</div>' +
        '</div>' +

        '<div class="mt-5">' +
          '<div class="flex items-center justify-between text-[11px] font-bold text-slate-500">' +
            '<span>' + ui.esc(agg.label) + '</span>' +
            '<span>' + (stepIndex + 1) + ' of ' + Store.STATUS_FLOW.length + ' steps</span>' +
          '</div>' +
          '<div class="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-light">' +
            '<div class="h-2 rounded-full bg-brand transition-all" style="width:' + pct + '%"></div>' +
          '</div>' +
          (agg.detail ? '<p class="mt-2 text-xs text-slate-500">' + ui.esc(agg.detail) + '</p>' : '') +
        '</div>' +
      '</div>' +

      '<div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">' +
        '<div class="min-w-0 space-y-4">' + order.sellerOrders.map(sellerOrderCard).join('') + '</div>' +

        '<aside class="min-w-0 space-y-4 lg:sticky lg:top-24">' +
          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<h3 class="font-display text-sm font-extrabold text-ink">Order summary</h3>' +
            '<div class="mt-3 space-y-2 text-xs">' +
              '<div class="flex items-center justify-between"><span class="text-slate-500">Subtotal</span><span class="font-semibold text-ink">' + ui.money(order.totals.subtotal) + '</span></div>' +
              '<div class="flex items-center justify-between"><span class="text-slate-500">Delivery</span><span class="font-semibold text-ink">' + ui.money(order.totals.delivery) + '</span></div>' +
              '<div class="flex items-center justify-between"><span class="text-slate-500">Service fee</span><span class="font-semibold text-ink">' + ui.money(order.totals.serviceFee) + '</span></div>' +
            '</div>' +
            '<div class="mt-3 flex items-center justify-between border-t border-dashed border-emerald-900/15 pt-3">' +
              '<span class="text-sm font-extrabold text-ink">Total</span>' +
              '<span class="font-display text-lg font-extrabold text-brand">' + ui.money(order.totals.grandTotal) + '</span>' +
            '</div>' +
            '<p class="mt-2 rounded-lg bg-brand-light px-2.5 py-1.5 text-[10px] font-semibold text-brand">' + ui.esc(order.paymentMethod) + (order.paymentMethod === 'COD' ? ' · pay on delivery' : ' · simulated') + '</p>' +
          '</div>' +

          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<h3 class="font-display text-sm font-extrabold text-ink">Delivering to</h3>' +
            '<p class="mt-2 text-xs font-bold text-ink">' + ui.esc(order.customer.name) + '</p>' +
            '<p class="mt-1 text-xs leading-relaxed text-slate-500">' + ui.esc(order.customer.address) + '</p>' +
            (order.customer.landmark ? '<p class="mt-1 text-[11px] text-slate-400">' + ui.esc(order.customer.landmark) + '</p>' : '') +
            (order.customer.instructions ? '<p class="mt-1 text-[11px] text-slate-400">Note: ' + ui.esc(order.customer.instructions) + '</p>' : '') +
          '</div>' +

          '<a href="index.html" class="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-600 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand">' +
            '<i data-lucide="arrow-left" class="h-3.5 w-3.5"></i> Continue shopping' +
          '</a>' +
        '</aside>' +
      '</div>';

    setupSwitcher();
    ui.refreshIcons();
  }

  Store.onChange(render);
  render();
})();
