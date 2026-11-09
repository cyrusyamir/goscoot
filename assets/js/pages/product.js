/* Product details + multi-seller comparison */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('products');

  var product = Store.getProduct(ui.qs('id'));
  var detailEl = document.getElementById('productDetail');
  var relatedSection = document.getElementById('relatedSection');

  if (!product) {
    detailEl.innerHTML = ui.emptyState(
      'package-x',
      'Product not found',
      'This product may have been removed by the seller. Browse the catalog for something similar.',
      '<a href="products.html" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">Browse products</a>'
    );
    if (relatedSection) relatedSection.style.display = 'none';
    ui.refreshIcons();
    return;
  }

  document.title = product.name + ' — GoScoot';
  document.getElementById('productCrumb').textContent = product.name;

  var offers = product.offers.slice().sort(function (a, b) {
    if (a.available !== b.available) return a.available ? -1 : 1;
    return a.price - b.price;
  });
  var available = Store.availableOffers(product);
  var cheapest = available.length ? available[0].price : null;
  var highestMrp = available.length ? available[0].mrp : null;
  var maxDiscount = available.reduce(function (max, offer) {
    return Math.max(max, ui.discountPercent(offer.mrp, offer.price));
  }, 0);

  function offerAction(offer) {
    var line = Store.getCartLine(product.id, offer.sellerId);
    var canBuy = offer.available && offer.stock > 0;

    if (!canBuy) {
      return '<span class="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-400">Out of stock</span>';
    }
    if (line) {
      return '<div class="qty-stepper" data-product-id="' + product.id + '" data-seller-id="' + offer.sellerId + '">' +
        '<button type="button" data-action="dec" aria-label="Decrease quantity">−</button>' +
        '<span>' + line.qty + '</span>' +
        '<button type="button" data-action="inc" aria-label="Increase quantity">+</button>' +
      '</div>';
    }
    return '<button type="button" data-action="add" data-product-id="' + product.id + '" data-seller-id="' + offer.sellerId + '" ' +
      'class="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark">Select seller</button>';
  }

  function renderOffers() {
    var listEl = document.getElementById('offerList');
    if (!listEl) return;

    listEl.innerHTML = offers.map(function (offer) {
      var seller = Store.getSeller(offer.sellerId);
      if (!seller) return '';
      var line = Store.getCartLine(product.id, offer.sellerId);
      var canBuy = offer.available && offer.stock > 0;
      var isCheapest = canBuy && offer.price === cheapest;
      var discount = ui.discountPercent(offer.mrp, offer.price);

      return '' +
        '<div class="rounded-xl border p-3 transition ' +
          (line ? 'border-brand/40 bg-brand-light/50' : isCheapest ? 'border-brand/25 bg-brand-light/30' : 'border-emerald-900/10 bg-white') + '">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<div class="flex min-w-0 items-start gap-3">' +
              '<div class="emoji-tile h-11 w-11 shrink-0 text-xl">' + ui.esc(seller.emoji) + '</div>' +
              '<div class="min-w-0">' +
                '<div class="flex flex-wrap items-center gap-2">' +
                  '<a href="shop.html?id=' + encodeURIComponent(seller.id) + '" class="truncate text-sm font-bold text-ink hover:text-brand">' + ui.esc(seller.name) + '</a>' +
                  (isCheapest ? '<span class="rounded-full bg-lime px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-brand-dark">Lowest price</span>' : '') +
                '</div>' +
                '<p class="truncate text-[11px] text-slate-500">' + ui.esc(seller.category) + ' · ' + ui.esc(seller.location) + '</p>' +
                '<div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">' +
                  '<span class="inline-flex items-center gap-1"><span class="text-amber-500">★</span>' + seller.rating.toFixed(1) + '</span>' +
                  '<span class="inline-flex items-center gap-1"><i data-lucide="timer" class="h-3 w-3"></i>' + seller.etaMin + '–' + seller.etaMax + ' min</span>' +
                  '<span class="inline-flex items-center gap-1">' +
                    (canBuy
                      ? '<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>' + (offer.stock <= 5 ? 'Only ' + offer.stock + ' left' : 'In stock')
                      : '<span class="h-1.5 w-1.5 rounded-full bg-rose-400"></span>Out of stock') +
                  '</span>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="shrink-0 text-right">' +
              '<p class="text-lg font-extrabold text-brand">' + ui.money(offer.price) + '</p>' +
              (offer.mrp > offer.price ? '<p class="text-[11px] text-slate-400 line-through">' + ui.money(offer.mrp) + '</p>' : '') +
              (discount ? '<p class="text-[10px] font-bold text-emerald-600">' + discount + '% off</p>' : '') +
            '</div>' +
          '</div>' +
          '<div class="mt-3 flex items-center justify-between gap-3 border-t border-dashed border-emerald-900/10 pt-3">' +
            '<p class="text-[11px] text-slate-500">Delivery by GoScoot · ' + seller.etaMin + '–' + seller.etaMax + ' min</p>' +
            offerAction(offer) +
          '</div>' +
        '</div>';
    }).join('');

    ui.refreshIcons();
  }

  function renderDetail() {
    detailEl.innerHTML = '' +
      '<div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">' +
        '<div class="min-w-0 self-start lg:sticky lg:top-24">' +
          '<div class="rounded-3xl border border-emerald-900/10 bg-white p-4">' +
            '<div class="emoji-tile relative aspect-square rounded-2xl text-[7rem] sm:text-[9rem]">' +
              '<span>' + ui.esc(product.emoji) + '</span>' +
              (maxDiscount ? '<span class="discount-pill absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs">' + maxDiscount + '% off</span>' : '') +
            '</div>' +
            '<div class="mt-4 grid grid-cols-3 gap-2 text-center">' +
              '<div class="rounded-xl bg-canvas px-2 py-2.5"><i data-lucide="bike" class="mx-auto h-4 w-4 text-brand"></i><p class="mt-1 text-[10px] font-bold text-slate-600">GoScoot delivery</p></div>' +
              '<div class="rounded-xl bg-canvas px-2 py-2.5"><i data-lucide="timer" class="mx-auto h-4 w-4 text-brand"></i><p class="mt-1 text-[10px] font-bold text-slate-600">15–45 min</p></div>' +
              '<div class="rounded-xl bg-canvas px-2 py-2.5"><i data-lucide="banknote" class="mx-auto h-4 w-4 text-brand"></i><p class="mt-1 text-[10px] font-bold text-slate-600">COD available</p></div>' +
            '</div>' +
            '<div class="mt-4 rounded-xl bg-brand-light p-3">' +
              '<p class="text-xs font-bold text-brand">GoScoot is your delivery partner</p>' +
              '<p class="mt-1 text-[11px] leading-relaxed text-brand/80">This item is sold and packed by the local seller you choose. GoScoot only handles pickup and delivery.</p>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="min-w-0">' +
          '<p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">' + ui.esc(product.brand) + ' · ' + ui.esc(product.unit) + '</p>' +
          '<h1 class="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">' + ui.esc(product.name) + '</h1>' +
          '<p class="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">' + ui.esc(product.description) + '</p>' +

          '<div class="mt-4 flex flex-wrap items-center gap-2">' +
            '<span class="rounded-full bg-brand-light px-3 py-1 text-[11px] font-bold text-brand">' + ui.esc(product.category) + '</span>' +
            '<span class="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-emerald-900/10">' +
              available.length + (available.length === 1 ? ' seller available' : ' sellers available') +
            '</span>' +
            (cheapest !== null
              ? '<span class="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-emerald-900/10">From <strong class="text-brand">' + ui.money(cheapest) + '</strong></span>'
              : '<span class="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-600">Currently unavailable</span>') +
            (highestMrp && cheapest !== null && highestMrp > cheapest
              ? '<span class="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-emerald-900/10">MRP <span class="line-through">' + ui.money(highestMrp) + '</span></span>'
              : '') +
          '</div>' +

          '<div class="mt-6 rounded-2xl border border-emerald-900/10 bg-white p-4 md:p-5">' +
            '<div class="flex items-start justify-between gap-3">' +
              '<div>' +
                '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Choose your seller</h2>' +
                '<p class="mt-0.5 text-xs text-slate-500">Same product, different shops. You pick who fulfils your order.</p>' +
              '</div>' +
              '<span class="hidden shrink-0 items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-[10px] font-bold text-brand sm:flex">' +
                '<i data-lucide="arrow-up-down" class="h-3 w-3"></i> Lowest price first' +
              '</span>' +
            '</div>' +
            '<div id="offerList" class="mt-4 space-y-3"></div>' +
          '</div>' +

          '<div class="mt-4 rounded-2xl border border-dashed border-emerald-900/15 bg-white/60 p-4">' +
            '<p class="text-xs font-bold text-ink">Why do prices differ between sellers?</p>' +
            '<p class="mt-1 text-[11px] leading-relaxed text-slate-500">Each local shop sets its own price, stock and delivery time. GoScoot does not control seller pricing — we simply show you the options and deliver whichever shop you choose.</p>' +
          '</div>' +
        '</div>' +
      '</div>';

    renderOffers();
  }

  /* Related products */
  var related = Store.getProducts().filter(function (p) {
    return p.id !== product.id && p.category === product.category;
  }).slice(0, 4);

  var relatedLink = document.getElementById('relatedLink');
  if (relatedLink) relatedLink.href = 'products.html?category=' + encodeURIComponent(product.category);
  var relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    relatedGrid.innerHTML = related.map(function (p) { return ui.productCard(p); }).join('');
  }
  if (!related.length && relatedSection) relatedSection.style.display = 'none';

  detailEl.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]');
    if (!btn) return;
    var holder = btn.closest('[data-product-id][data-seller-id]') || btn;
    var productId = holder.getAttribute('data-product-id');
    var sellerId = holder.getAttribute('data-seller-id');
    var action = btn.getAttribute('data-action');
    var line = Store.getCartLine(productId, sellerId);

    if (action === 'add') {
      if (Store.addToCart(productId, sellerId, 1)) ui.toast('Added to cart');
    } else if (action === 'inc') {
      Store.setQty(productId, sellerId, (line ? line.qty : 0) + 1);
    } else if (action === 'dec') {
      Store.setQty(productId, sellerId, (line ? line.qty : 0) - 1);
    }
  });

  Store.onChange(renderOffers);

  renderDetail();
  ui.refreshIcons();
})();
