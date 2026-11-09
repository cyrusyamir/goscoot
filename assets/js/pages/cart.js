/* Shopping cart */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('cart');

  var root = document.getElementById('cartRoot');
  var subtitle = document.getElementById('cartSubtitle');

  function itemRow(line) {
    var lowStock = line.offer.stock <= 5;
    return '' +
      '<div class="flex items-start gap-3 border-t border-dashed border-emerald-900/10 py-3 first:border-t-0 first:pt-0">' +
        '<a href="product.html?id=' + encodeURIComponent(line.product.id) + '" class="emoji-tile h-14 w-14 shrink-0 text-2xl">' + ui.esc(line.product.emoji) + '</a>' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<div class="min-w-0">' +
              '<a href="product.html?id=' + encodeURIComponent(line.product.id) + '" class="line-clamp-1 text-sm font-bold text-ink hover:text-brand">' + ui.esc(line.product.name) + '</a>' +
              '<p class="text-[11px] text-slate-400">' + ui.esc(line.product.brand) + ' · ' + ui.esc(line.product.unit) + '</p>' +
              '<p class="mt-0.5 text-[11px] font-semibold text-slate-500">' + ui.money(line.offer.price) + ' each</p>' +
              (lowStock ? '<p class="mt-0.5 text-[10px] font-bold text-amber-600">Only ' + line.offer.stock + ' left at this shop</p>' : '') +
            '</div>' +
            '<div class="shrink-0 text-right">' +
              '<p class="text-sm font-extrabold text-ink">' + ui.money(line.lineTotal) + '</p>' +
              (line.offer.mrp > line.offer.price
                ? '<p class="text-[10px] text-slate-400 line-through">' + ui.money(line.offer.mrp * line.qty) + '</p>'
                : '') +
            '</div>' +
          '</div>' +
          '<div class="mt-2 flex items-center justify-between">' +
            '<div class="qty-stepper" data-product-id="' + line.productId + '" data-seller-id="' + line.sellerId + '">' +
              '<button type="button" data-action="dec" aria-label="Decrease quantity">−</button>' +
              '<span>' + line.qty + '</span>' +
              '<button type="button" data-action="inc" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" data-action="remove" data-product-id="' + line.productId + '" data-seller-id="' + line.sellerId + '" ' +
              'class="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">' +
              '<i data-lucide="trash-2" class="h-3.5 w-3.5"></i> Remove' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function groupCard(group) {
    var belowMin = group.subtotal < group.seller.minOrder;
    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex items-start justify-between gap-3 pb-3">' +
          '<div class="flex min-w-0 items-center gap-3">' +
            '<div class="emoji-tile h-11 w-11 shrink-0 text-xl">' + ui.esc(group.seller.emoji) + '</div>' +
            '<div class="min-w-0">' +
              '<a href="shop.html?id=' + encodeURIComponent(group.seller.id) + '" class="truncate text-sm font-extrabold text-ink hover:text-brand">' + ui.esc(group.seller.name) + '</a>' +
              '<p class="text-[11px] text-slate-500">' + ui.esc(group.seller.location) + ' · ' + group.seller.etaMin + '–' + group.seller.etaMax + ' min</p>' +
            '</div>' +
          '</div>' +
          '<span class="shrink-0 rounded-full bg-brand-light px-2.5 py-1 text-[10px] font-bold text-brand">Delivery ' + ui.money(group.deliveryFee) + '</span>' +
        '</div>' +
        '<div>' + group.lines.map(itemRow).join('') + '</div>' +
        '<div class="mt-3 flex items-center justify-between border-t border-emerald-900/10 pt-3">' +
          '<span class="text-xs text-slate-500">Shop subtotal</span>' +
          '<span class="text-sm font-extrabold text-ink">' + ui.money(group.subtotal) + '</span>' +
        '</div>' +
        (belowMin
          ? '<p class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">' +
              'Below this shop\'s ' + ui.money(group.seller.minOrder) + ' minimum order. Add a little more or the seller may not accept.' +
            '</p>'
          : '') +
      '</div>';
  }

  function summaryCard(summary) {
    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4 lg:sticky lg:top-24">' +
        '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Order summary</h2>' +
        '<div class="mt-4 space-y-2.5 text-sm">' +
          '<div class="flex items-center justify-between"><span class="text-slate-500">Subtotal</span><span class="font-semibold text-ink">' + ui.money(summary.subtotal) + '</span></div>' +
          summary.groups.map(function (group) {
            return '<div class="flex items-center justify-between text-xs text-slate-400"><span class="truncate pr-2">Delivery · ' + ui.esc(group.seller.name) + '</span><span>' + ui.money(group.deliveryFee) + '</span></div>';
          }).join('') +
          '<div class="flex items-center justify-between"><span class="text-slate-500">Service fee</span><span class="font-semibold text-ink">' + ui.money(summary.serviceFee) + '</span></div>' +
        '</div>' +
        '<div class="mt-4 flex items-center justify-between border-t border-dashed border-emerald-900/15 pt-4">' +
          '<span class="font-display text-base font-extrabold text-ink">Total</span>' +
          '<span class="font-display text-xl font-extrabold text-brand">' + ui.money(summary.grandTotal) + '</span>' +
        '</div>' +
        '<div class="mt-2 flex items-center gap-1.5 rounded-lg bg-brand-light px-3 py-2 text-[11px] font-semibold text-brand">' +
          '<i data-lucide="split" class="h-3.5 w-3.5 shrink-0"></i>' +
          'One checkout · ' + summary.sellerCount + (summary.sellerCount === 1 ? ' seller fulfilment' : ' seller fulfilments') +
        '</div>' +
        '<a href="checkout.html" class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark">' +
          'Proceed to checkout <i data-lucide="arrow-right" class="h-4 w-4"></i>' +
        '</a>' +
        '<a href="products.html" class="mt-2 flex w-full items-center justify-center rounded-xl py-2 text-xs font-bold text-slate-500 transition hover:bg-canvas hover:text-brand">Continue shopping</a>' +
        '<p class="mt-3 text-center text-[10px] leading-relaxed text-slate-400">Each shop packs its own items. GoScoot picks up and delivers. No real payment is taken in this demo.</p>' +
      '</div>';
  }

  function render() {
    var summary = Store.getCartSummary();

    if (!summary.groups.length) {
      subtitle.textContent = 'Nothing here yet.';
      root.innerHTML = ui.emptyState(
        'shopping-cart',
        'Your cart is empty',
        'Browse local shops and add products from the sellers you prefer. Your cart keeps every shop separate.',
        '<a href="products.html" class="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">Start shopping</a>'
      );
      ui.refreshIcons();
      return;
    }

    subtitle.textContent = summary.count + (summary.count === 1 ? ' item' : ' items') +
      ' from ' + summary.sellerCount + (summary.sellerCount === 1 ? ' local shop' : ' local shops') +
      ' · delivered by GoScoot';

    root.innerHTML = '' +
      '<div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">' +
        '<div class="space-y-4">' + summary.groups.map(groupCard).join('') + '</div>' +
        '<div>' + summaryCard(summary) + '</div>' +
      '</div>';

    ui.refreshIcons();
  }

  root.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]');
    if (!btn) return;
    var holder = btn.closest('[data-product-id][data-seller-id]') || btn;
    var productId = holder.getAttribute('data-product-id');
    var sellerId = holder.getAttribute('data-seller-id');
    var action = btn.getAttribute('data-action');
    var line = Store.getCartLine(productId, sellerId);

    if (action === 'remove') {
      Store.removeLine(productId, sellerId);
      ui.toast('Removed from cart');
    } else if (action === 'inc') {
      Store.setQty(productId, sellerId, (line ? line.qty : 0) + 1);
    } else if (action === 'dec') {
      Store.setQty(productId, sellerId, (line ? line.qty : 0) - 1);
    }
  });

  Store.onChange(render);
  render();
})();
