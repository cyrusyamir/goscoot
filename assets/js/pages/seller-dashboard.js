/* Seller dashboard overview */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;
  var shell = window.GS.seller.mount('overview');

  var seller = shell.seller;
  var sellerId = shell.sellerId;
  var headingEl = document.getElementById('sellerHeading');
  var root = document.getElementById('sellerDashboard');

  var TONES = {
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600',
    green: 'bg-emerald-50 text-emerald-600',
    slate: 'bg-slate-100 text-slate-500',
    rose: 'bg-rose-50 text-rose-600'
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

  function miniStat(label, value, icon) {
    return '' +
      '<div class="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-emerald-900/5">' +
        '<span class="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-brand ring-1 ring-emerald-900/10">' +
          '<i data-lucide="' + icon + '" class="h-3.5 w-3.5"></i>' +
        '</span>' +
        '<div class="min-w-0">' +
          '<p class="text-sm font-extrabold leading-tight text-ink">' + value + '</p>' +
          '<p class="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-400">' + ui.esc(label) + '</p>' +
        '</div>' +
      '</div>';
  }

  function renderHeading() {
    headingEl.innerHTML = '' +
      '<div class="overflow-hidden rounded-3xl bg-brand text-white">' +
        '<div class="hero-pattern flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-7">' +
          '<div class="flex min-w-0 items-start gap-4">' +
            '<div class="emoji-tile emoji-tile--brand h-14 w-14 shrink-0 text-2xl ring-1 ring-white/20 md:h-16 md:w-16 md:text-3xl">' + ui.esc(seller.emoji) + '</div>' +
            '<div class="min-w-0">' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<h1 class="font-display text-2xl font-extrabold tracking-tight md:text-3xl">' + ui.esc(seller.name) + '</h1>' +
                '<span class="rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-dark">Seller dashboard</span>' +
              '</div>' +
              '<p class="mt-1 text-sm text-white/75">' + ui.esc(seller.category) + ' · ' + ui.esc(seller.location) + '</p>' +
              '<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/85">' +
                '<span class="inline-flex items-center gap-1"><span class="text-lime">★</span>' + seller.rating.toFixed(1) + ' rating</span>' +
                '<span class="inline-flex items-center gap-1"><i data-lucide="timer" class="h-3.5 w-3.5 text-lime"></i>' + seller.etaMin + '–' + seller.etaMax + ' min</span>' +
                '<span class="inline-flex items-center gap-1"><i data-lucide="package" class="h-3.5 w-3.5 text-lime"></i>Min ' + ui.money(seller.minOrder) + '</span>' +
                '<span class="inline-flex items-center gap-1"><i data-lucide="bike" class="h-3.5 w-3.5 text-lime"></i>' + ui.money(seller.deliveryFee) + ' delivery</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="flex flex-wrap gap-2">' +
            '<a href="orders.html" class="inline-flex items-center gap-1.5 rounded-xl bg-lime px-4 py-2.5 text-sm font-bold text-brand-dark transition hover:bg-lime-dark">' +
              '<i data-lucide="receipt-text" class="h-4 w-4"></i> View orders' +
            '</a>' +
            '<a href="products.html" class="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/15">' +
              '<i data-lucide="package" class="h-4 w-4"></i> Products' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function itemLines(sellerOrder) {
    return sellerOrder.items.map(function (item) {
      return '<div class="flex items-start justify-between gap-3 text-xs">' +
        '<span class="text-slate-500"><span class="font-bold text-ink">' + item.qty + '×</span> ' + ui.esc(item.emoji) + ' ' + ui.esc(item.name) + '</span>' +
        '<span class="shrink-0 font-semibold text-ink">' + ui.money(item.price * item.qty) + '</span>' +
      '</div>';
    }).join('');
  }

  function actionCard(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var action = window.GS.seller.nextAction(so.status);

    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex flex-wrap items-start justify-between gap-2">' +
          '<div>' +
            '<p class="text-sm font-extrabold text-ink">' + ui.esc(order.id) + '</p>' +
            '<p class="text-[11px] text-slate-400">' + ui.formatDateTime(order.createdAt) + ' · ' + ui.esc(order.customer.name) + '</p>' +
          '</div>' +
          ui.statusBadge(so.status) +
        '</div>' +
        '<div class="mt-3 space-y-1.5 rounded-xl bg-canvas p-3">' + itemLines(so) + '</div>' +
        '<div class="mt-3 flex flex-wrap items-center justify-between gap-2">' +
          '<div>' +
            '<p class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal) + '</p>' +
            '<p class="text-[10px] text-slate-400">' + window.GS.seller.countItems(so) + ' items · shop subtotal</p>' +
          '</div>' +
          (action
            ? '<button type="button" data-action="advance" data-order-id="' + ui.esc(order.id) + '" data-next="' + action.status + '" ' +
                'class="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">' +
                '<i data-lucide="' + action.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(action.label) +
              '</button>'
            : '') +
        '</div>' +
      '</div>';
  }

  function readyRow(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    return '' +
      '<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-emerald-900/5">' +
        '<div class="min-w-0">' +
          '<p class="truncate text-xs font-bold text-ink">' + ui.esc(order.id) + ' · ' + ui.esc(order.customer.name) + '</p>' +
          '<p class="text-[10px] text-slate-400">' + window.GS.seller.countItems(so) + ' items · ' + ui.money(so.subtotal) + ' · ready since ' + ui.formatDateTime((so.history || []).slice(-1)[0] && (so.history || []).slice(-1)[0].at) + '</p>' +
        '</div>' +
        '<span class="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 ring-1 ring-violet-200">' +
          '<i data-lucide="bike" class="h-3 w-3"></i> Awaiting GoScoot' +
        '</span>' +
      '</div>';
  }

  function stockRow(entry) {
    var product = entry.product;
    var offer = entry.offer;
    var out = !offer.available || offer.stock <= 0;
    return '' +
      '<div class="flex items-center gap-3 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-emerald-900/5">' +
        '<div class="emoji-tile h-9 w-9 shrink-0 text-lg">' + ui.esc(product.emoji) + '</div>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="truncate text-xs font-bold text-ink">' + ui.esc(product.name) + '</p>' +
          '<p class="text-[10px] text-slate-400">' + ui.money(offer.price) + ' · ' + ui.esc(product.unit) + '</p>' +
        '</div>' +
        '<span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ' +
          (out ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700') + '">' +
          (out ? 'Out of stock' : offer.stock + ' left') +
        '</span>' +
      '</div>';
  }

  function render() {
    var s = window.GS.seller.stats(sellerId);
    var entries = window.GS.seller.ordersFor(sellerId);
    var actionable = entries.filter(function (entry) {
      return window.GS.seller.nextAction(entry.sellerOrder.status);
    });
    var ready = entries.filter(function (entry) { return entry.sellerOrder.status === 'ready_for_pickup'; });
    var delivered = entries.filter(function (entry) { return entry.sellerOrder.status === 'delivered'; }).slice(0, 3);
    var lowStock = window.GS.seller.sellerOffers(sellerId).filter(function (entry) {
      return !entry.offer.available || entry.offer.stock <= 5;
    }).sort(function (a, b) { return a.offer.stock - b.offer.stock; }).slice(0, 5);

    root.innerHTML = '' +
      '<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">' +
        kpi('New orders', s.newOrders, 'Waiting for you to accept', 'bell-ring', 'amber') +
        kpi('Preparing', s.preparing, 'Confirmed or being packed', 'cooking-pot', 'blue') +
        kpi('Ready for pickup', s.ready, 'GoScoot will collect', 'package-check', 'violet') +
        kpi('Delivered revenue', ui.money(s.revenue), s.delivered + ' delivered orders', 'wallet', 'green') +
      '</div>' +

      '<div class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">' +
        miniStat('Products listed', s.products, 'package') +
        miniStat('Low stock', s.lowStock, 'triangle-alert') +
        miniStat('Out of stock', s.outOfStock, 'package-x') +
        miniStat('Items to pack', s.itemsToPack, 'boxes') +
      '</div>' +

      '<div class="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">' +
        '<div class="space-y-5">' +
          '<section>' +
            '<div class="flex items-end justify-between gap-3">' +
              '<div>' +
                '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Orders needing action</h2>' +
                '<p class="mt-0.5 text-xs text-slate-500">Accept, prepare and hand over. GoScoot handles the ride.</p>' +
              '</div>' +
              '<a href="orders.html" class="shrink-0 text-xs font-bold text-brand hover:underline">All orders</a>' +
            '</div>' +
            '<div class="mt-3 space-y-3">' +
              (actionable.length
                ? actionable.slice(0, 4).map(actionCard).join('')
                : '<div class="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-4 py-8 text-center">' +
                    '<div class="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-brand-light text-brand"><i data-lucide="check-check" class="h-5 w-5"></i></div>' +
                    '<p class="mt-2 text-sm font-bold text-ink">You are all caught up</p>' +
                    '<p class="mt-0.5 text-xs text-slate-500">New orders will appear here as customers check out.</p>' +
                  '</div>') +
            '</div>' +
          '</section>' +

          '<section>' +
            '<div class="flex items-end justify-between gap-3">' +
              '<div>' +
                '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Ready for GoScoot pickup</h2>' +
                '<p class="mt-0.5 text-xs text-slate-500">Packed orders waiting for a delivery partner.</p>' +
              '</div>' +
            '</div>' +
            '<div class="mt-3 space-y-2">' +
              (ready.length
                ? ready.slice(0, 4).map(readyRow).join('')
                : '<div class="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-4 py-5 text-center text-xs text-slate-500">No packed orders waiting right now.</div>') +
            '</div>' +
          '</section>' +

          '<section>' +
            '<div class="flex items-end justify-between gap-3">' +
              '<div>' +
                '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Recently delivered</h2>' +
                '<p class="mt-0.5 text-xs text-slate-500">Completed fulfilments from this shop.</p>' +
              '</div>' +
            '</div>' +
            '<div class="mt-3 space-y-2">' +
              (delivered.length
                ? delivered.map(function (entry) {
                    return '<div class="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-emerald-900/10">' +
                      '<div>' +
                        '<p class="text-xs font-bold text-ink">' + ui.esc(entry.order.id) + ' · ' + ui.esc(entry.order.customer.name) + '</p>' +
                        '<p class="text-[10px] text-slate-400">' + ui.formatDateTime(entry.order.createdAt) + '</p>' +
                      '</div>' +
                      '<span class="text-sm font-extrabold text-brand">' + ui.money(entry.sellerOrder.subtotal) + '</span>' +
                    '</div>';
                  }).join('')
                : '<div class="rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 px-4 py-5 text-center text-xs text-slate-500">No delivered orders yet.</div>') +
            '</div>' +
          '</section>' +
        '</div>' +

        '<aside class="space-y-4">' +
          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<div class="flex items-center justify-between gap-2">' +
              '<h2 class="font-display text-sm font-extrabold text-ink">Stock alerts</h2>' +
              '<a href="products.html" class="text-[11px] font-bold text-brand hover:underline">Manage</a>' +
            '</div>' +
            '<div class="mt-3 space-y-2">' +
              (lowStock.length
                ? lowStock.map(stockRow).join('')
                : '<p class="rounded-xl bg-brand-light px-3 py-3 text-center text-[11px] font-semibold text-brand">All products are well stocked.</p>') +
            '</div>' +
          '</div>' +

          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
            '<h2 class="font-display text-sm font-extrabold text-ink">Seller demo tips</h2>' +
            '<ul class="mt-3 space-y-2.5 text-[11px] leading-relaxed text-slate-500">' +
              '<li class="flex gap-2"><i data-lucide="store" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Use the <strong class="text-ink">Shop</strong> switcher in the header to manage any of the six demo sellers.</span></li>' +
              '<li class="flex gap-2"><i data-lucide="receipt-text" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Accept an order, mark it ready, then watch the customer tracking page update.</span></li>' +
              '<li class="flex gap-2"><i data-lucide="package" class="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand"></i><span>Edit prices and stock on the Products page. Changes are saved in this browser.</span></li>' +
            '</ul>' +
          '</div>' +
        '</aside>' +
      '</div>';

    ui.refreshIcons();
  }

  root.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action="advance"]');
    if (!btn) return;
    var orderId = btn.getAttribute('data-order-id');
    var next = btn.getAttribute('data-next');
    window.GS.seller.setStatus(orderId, sellerId, next, 'Order updated to ' + (Store.STATUS_META[next] || {}).short);
  });

  renderHeading();
  Store.onChange(render);
  render();
})();
