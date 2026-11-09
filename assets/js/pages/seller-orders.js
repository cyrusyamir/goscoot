/* Seller orders — accept, prepare and hand over */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;
  var shell = window.GS.seller.mount('orders');

  var sellerId = shell.sellerId;
  var tabsEl = document.getElementById('sellerOrdersTabs');
  var root = document.getElementById('sellerOrders');
  var subtitleEl = document.getElementById('sellerOrdersSubtitle');

  var state = { tab: 'all' };

  var TABS = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'transit', label: 'In transit' },
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' }
  ];

  function matches(tab, status) {
    if (tab === 'all') return true;
    if (tab === 'new') return status === 'placed';
    if (tab === 'preparing') return status === 'confirmed' || status === 'preparing';
    if (tab === 'ready') return status === 'ready_for_pickup';
    if (tab === 'transit') return status === 'picked_up' || status === 'out_for_delivery';
    if (tab === 'completed') return status === 'delivered';
    if (tab === 'rejected') return status === 'rejected';
    return true;
  }

  function countFor(tab) {
    return window.GS.seller.ordersFor(sellerId).filter(function (entry) {
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

  function customerBlock(order) {
    var c = order.customer;
    return '' +
      '<div class="mt-3 rounded-xl bg-canvas p-3">' +
        '<div class="flex flex-wrap items-center gap-x-3 gap-y-1">' +
          '<p class="text-xs font-extrabold text-ink">' + ui.esc(c.name) + '</p>' +
          '<a href="tel:' + ui.esc(c.phone) + '" class="inline-flex items-center gap-1 text-[11px] font-bold text-brand hover:underline">' +
            '<i data-lucide="phone" class="h-3 w-3"></i>' + ui.esc(c.phone) +
          '</a>' +
        '</div>' +
        '<p class="mt-1 text-[11px] leading-relaxed text-slate-500">' + ui.esc(c.address) + '</p>' +
        (c.landmark ? '<p class="mt-0.5 text-[10px] text-slate-400">Landmark: ' + ui.esc(c.landmark) + '</p>' : '') +
        (c.instructions ? '<p class="mt-1 inline-flex items-start gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"><i data-lucide="message-square" class="mt-0.5 h-3 w-3 shrink-0"></i>' + ui.esc(c.instructions) + '</p>' : '') +
      '</div>';
  }

  function actionRow(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var action = window.GS.seller.nextAction(so.status);
    var canReject = so.status === 'placed' || so.status === 'confirmed';

    if (action) {
      return '' +
        '<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-emerald-900/10 pt-3">' +
          '<div>' +
            '<p class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal) + '</p>' +
            '<p class="text-[10px] text-slate-400">' + window.GS.seller.countItems(so) + ' items · shop subtotal</p>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2">' +
            (canReject
              ? '<button type="button" data-action="reject" data-order-id="' + ui.esc(order.id) + '" ' +
                  'class="rounded-lg bg-white px-3 py-2 text-xs font-bold text-rose-600 ring-1 ring-rose-200 transition hover:bg-rose-50">Reject</button>'
              : '') +
            '<button type="button" data-action="advance" data-order-id="' + ui.esc(order.id) + '" data-next="' + action.status + '" ' +
              'class="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">' +
              '<i data-lucide="' + action.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(action.label) +
            '</button>' +
          '</div>' +
        '</div>';
    }

    var notes = {
      ready_for_pickup: { icon: 'bike', text: 'Packed and waiting for GoScoot pickup', tone: 'violet' },
      picked_up: { icon: 'package', text: 'Picked up by GoScoot', tone: 'violet' },
      out_for_delivery: { icon: 'bike', text: 'Out for delivery', tone: 'violet' },
      delivered: { icon: 'check-check', text: 'Delivered to the customer', tone: 'green' },
      rejected: { icon: 'x-circle', text: 'This order was rejected', tone: 'rose' }
    };
    var note = notes[so.status] || { icon: 'clock', text: so.status, tone: 'slate' };
    var toneClasses = {
      violet: 'bg-violet-50 text-violet-700 ring-violet-200',
      green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
      rose: 'bg-rose-50 text-rose-700 ring-rose-200',
      slate: 'bg-slate-100 text-slate-600 ring-slate-200'
    };

    return '' +
      '<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-emerald-900/10 pt-3">' +
        '<div>' +
          '<p class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal) + '</p>' +
          '<p class="text-[10px] text-slate-400">' + window.GS.seller.countItems(so) + ' items · shop subtotal</p>' +
        '</div>' +
        '<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ' + (toneClasses[note.tone] || toneClasses.slate) + '">' +
          '<i data-lucide="' + note.icon + '" class="h-3.5 w-3.5"></i> ' + ui.esc(note.text) +
        '</span>' +
      '</div>';
  }

  function orderCard(entry) {
    var order = entry.order;
    var so = entry.sellerOrder;
    var others = order.sellerOrders.length - 1;

    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex flex-wrap items-start justify-between gap-2">' +
          '<div>' +
            '<div class="flex flex-wrap items-center gap-2">' +
              '<p class="font-display text-base font-extrabold tracking-tight text-ink">' + ui.esc(order.id) + '</p>' +
              ui.statusBadge(so.status) +
            '</div>' +
            '<p class="mt-0.5 text-[11px] text-slate-400">Placed ' + ui.formatDateTime(order.createdAt) + ' · ' + ui.esc(order.paymentMethod) + '</p>' +
          '</div>' +
          '<div class="text-right">' +
            '<p class="text-sm font-extrabold text-ink">' + ui.money(so.subtotal + so.deliveryFee) + '</p>' +
            '<p class="text-[10px] text-slate-400">items + delivery</p>' +
          '</div>' +
        '</div>' +

        (others > 0
          ? '<p class="mt-2 inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-700">' +
              '<i data-lucide="split" class="h-3 w-3"></i> Part of a multi-shop order · ' + others + ' other shop' + (others === 1 ? '' : 's') +
            '</p>'
          : '') +

        customerBlock(order) +

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

    var entries = window.GS.seller.ordersFor(sellerId).filter(function (entry) {
      return matches(state.tab, entry.sellerOrder.status);
    });

    var newCount = countFor('new');
    subtitleEl.textContent = entries.length + (entries.length === 1 ? ' order' : ' orders') +
      ' in this view · ' + newCount + ' waiting for acceptance';

    if (!entries.length) {
      root.innerHTML = ui.emptyState(
        'receipt-text',
        'No orders here',
        'Nothing matches this filter. New customer orders will appear in the New tab.',
        '<button type="button" data-tab="new" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">View new orders</button>'
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
    var orderId = btn.getAttribute('data-order-id');
    var action = btn.getAttribute('data-action');

    if (action === 'advance') {
      var next = btn.getAttribute('data-next');
      window.GS.seller.setStatus(orderId, sellerId, next, 'Order updated to ' + (Store.STATUS_META[next] || {}).short);
    } else if (action === 'reject') {
      if (!window.confirm('Reject order ' + orderId + '? The customer will see it as rejected in this demo.')) return;
      window.GS.seller.setStatus(orderId, sellerId, 'rejected', 'Order rejected');
    }
  });

  Store.onChange(render);
  render();
})();
