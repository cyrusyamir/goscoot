/* Order confirmation */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('confirmation');

  var root = document.getElementById('confirmationRoot');
  var order = Store.getOrder(ui.qs('id'));

  if (!order) {
    root.innerHTML = ui.emptyState(
      'receipt-text',
      'Order not found',
      'We could not find that order in this browser. Place a new order or reset the demo from the footer.',
      '<a href="index.html" class="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">Back to home</a>'
    );
    ui.refreshIcons();
    return;
  }

  document.title = 'Order ' + order.id + ' confirmed — GoScoot';
  var agg = Store.aggregateStatus(order);

  function sellerCard(sellerOrder) {
    var seller = Store.getSeller(sellerOrder.sellerId);
    if (!seller) return '';
    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex items-start justify-between gap-3">' +
          '<div class="flex min-w-0 items-center gap-2.5">' +
            '<div class="emoji-tile h-10 w-10 shrink-0 text-lg">' + ui.esc(seller.emoji) + '</div>' +
            '<div class="min-w-0">' +
              '<p class="truncate text-sm font-extrabold text-ink">' + ui.esc(seller.name) + '</p>' +
              '<p class="text-[11px] text-slate-500">' + seller.etaMin + '–' + seller.etaMax + ' min · ' + ui.esc(seller.location) + '</p>' +
            '</div>' +
          '</div>' +
          ui.statusBadge(sellerOrder.status) +
        '</div>' +
        '<div class="mt-3 space-y-1.5 border-t border-dashed border-emerald-900/10 pt-3">' +
          sellerOrder.items.map(function (item) {
            return '<div class="flex items-start justify-between gap-3 text-xs">' +
              '<span class="text-slate-500"><span class="font-bold text-ink">' + item.qty + '×</span> ' + ui.esc(item.emoji) + ' ' + ui.esc(item.name) + ' <span class="text-slate-400">(' + ui.esc(item.unit) + ')</span></span>' +
              '<span class="shrink-0 font-semibold text-ink">' + ui.money(item.price * item.qty) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<div class="mt-3 flex items-center justify-between border-t border-emerald-900/10 pt-2.5 text-xs">' +
          '<span class="text-slate-500">Shop subtotal + delivery</span>' +
          '<span class="font-extrabold text-ink">' + ui.money(sellerOrder.subtotal + sellerOrder.deliveryFee) + '</span>' +
        '</div>' +
      '</div>';
  }

  root.innerHTML = '' +
    '<div class="text-center">' +
      '<div class="success-ring mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-lime ring-8 ring-brand-light">' +
        '<i data-lucide="check" class="h-10 w-10"></i>' +
      '</div>' +
      '<h1 class="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink">Order placed!</h1>' +
      '<p class="mt-2 text-sm text-slate-500">Thanks, ' + ui.esc(order.customer.name) + '. Your order is with the local sellers now.</p>' +
      '<div class="mt-4 flex flex-wrap items-center justify-center gap-2">' +
        '<span class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink ring-1 ring-emerald-900/10">' +
          '<i data-lucide="receipt-text" class="h-3.5 w-3.5 text-brand"></i>' + ui.esc(order.id) +
        '</span>' +
        ui.aggregateBadge(order) +
        '<span class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-emerald-900/10">' +
          '<i data-lucide="clock" class="h-3.5 w-3.5 text-brand"></i>' + ui.formatDateTime(order.createdAt) +
        '</span>' +
      '</div>' +
    '</div>' +

    '<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">' +
      order.sellerOrders.map(sellerCard).join('') +
    '</div>' +

    '<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-5">' +
        '<h2 class="font-display text-base font-extrabold text-ink">Payment summary</h2>' +
        '<div class="mt-3 space-y-2 text-sm">' +
          '<div class="flex items-center justify-between"><span class="text-slate-500">Subtotal</span><span class="font-semibold text-ink">' + ui.money(order.totals.subtotal) + '</span></div>' +
          '<div class="flex items-center justify-between"><span class="text-slate-500">Delivery</span><span class="font-semibold text-ink">' + ui.money(order.totals.delivery) + '</span></div>' +
          '<div class="flex items-center justify-between"><span class="text-slate-500">Service fee</span><span class="font-semibold text-ink">' + ui.money(order.totals.serviceFee) + '</span></div>' +
        '</div>' +
        '<div class="mt-3 flex items-center justify-between border-t border-dashed border-emerald-900/15 pt-3">' +
          '<span class="font-display text-base font-extrabold text-ink">Total</span>' +
          '<span class="font-display text-xl font-extrabold text-brand">' + ui.money(order.totals.grandTotal) + '</span>' +
        '</div>' +
        '<p class="mt-3 rounded-lg bg-brand-light px-3 py-2 text-[11px] font-semibold text-brand">Payment method: ' + ui.esc(order.paymentMethod) + (order.paymentMethod === 'COD' ? ' · pay on delivery' : ' · simulated') + '</p>' +
      '</div>' +

      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-5">' +
        '<h2 class="font-display text-base font-extrabold text-ink">Delivering to</h2>' +
        '<p class="mt-3 text-sm font-bold text-ink">' + ui.esc(order.customer.name) + ' · ' + ui.esc(order.customer.phone) + '</p>' +
        '<p class="mt-1 text-sm leading-relaxed text-slate-500">' + ui.esc(order.customer.address) + '</p>' +
        (order.customer.landmark ? '<p class="mt-1 text-xs text-slate-400">Landmark: ' + ui.esc(order.customer.landmark) + '</p>' : '') +
        (order.customer.instructions ? '<p class="mt-1 text-xs text-slate-400">Instructions: ' + ui.esc(order.customer.instructions) + '</p>' : '') +
        '<div class="mt-3 flex items-start gap-2 rounded-lg bg-canvas p-3 text-[11px] leading-relaxed text-slate-500">' +
          '<i data-lucide="bike" class="mt-0.5 h-4 w-4 shrink-0 text-brand"></i>' +
          '<span>GoScoot will collect each shop\'s items and deliver them together. Sellers confirm and pack their own products.</span>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">' +
      '<a href="tracking.html?id=' + encodeURIComponent(order.id) + '" class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark">' +
        '<i data-lucide="map-pinned" class="h-4 w-4"></i> Track your order' +
      '</a>' +
      '<a href="products.html" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-600 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand">' +
        'Continue shopping' +
      '</a>' +
    '</div>' +
    '<p class="mt-4 text-center text-xs text-slate-400">' +
      'Sellers usually confirm within a few minutes. Open tracking to watch each shop\'s progress.' +
    '</p>';

  ui.refreshIcons();
})();
