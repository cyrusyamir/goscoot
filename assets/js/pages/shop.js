/* Shop details — products from one seller */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('shops');

  var seller = Store.getSeller(ui.qs('id'));

  if (!seller) {
    document.getElementById('shopHero').innerHTML = ui.emptyState(
      'store',
      'Shop not found',
      'This local seller may have been removed. Browse the other shops delivering near you.',
      '<a href="shops.html" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">Browse shops</a>'
    );
    document.getElementById('shopProducts').innerHTML = '';
    ui.refreshIcons();
    return;
  }

  document.title = seller.name + ' — GoScoot';
  document.getElementById('shopCrumb').textContent = seller.name;

  var products = Store.sellerProducts(seller.id).filter(function (product) {
    return Store.getOffer(product, seller.id);
  });

  function renderHero() {
    document.getElementById('shopHero').innerHTML = '' +
      '<div class="overflow-hidden rounded-3xl bg-brand text-white">' +
        '<div class="hero-pattern flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">' +
          '<div class="flex items-start gap-4">' +
            '<div class="emoji-tile emoji-tile--brand h-16 w-16 shrink-0 text-3xl ring-1 ring-white/20 md:h-20 md:w-20">' + ui.esc(seller.emoji) + '</div>' +
            '<div>' +
              '<div class="flex flex-wrap items-center gap-2">' +
                '<h1 class="font-display text-2xl font-extrabold tracking-tight md:text-3xl">' + ui.esc(seller.name) + '</h1>' +
                '<span class="rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-dark">Open now</span>' +
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
          '<div class="flex flex-wrap gap-2 md:max-w-[15rem] md:justify-end">' +
            seller.tags.map(function (tag) {
              return '<span class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">' + ui.esc(tag) + '</span>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function productCard(product) {
    var offer = Store.getOffer(product, seller.id);
    if (!offer) return '';
    var line = Store.getCartLine(product.id, seller.id);
    var discount = ui.discountPercent(offer.mrp, offer.price);
    var available = offer.available && offer.stock > 0;

    return '' +
      '<div class="flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-2.5 shadow-[0_10px_30px_-24px_rgba(23,107,69,.5)]">' +
        '<a href="product.html?id=' + encodeURIComponent(product.id) + '" class="emoji-tile relative aspect-[5/4] text-5xl">' +
          '<span>' + ui.esc(product.emoji) + '</span>' +
          (discount ? '<span class="discount-pill absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px]">' + discount + '% off</span>' : '') +
          (available && offer.stock <= 5 ? '<span class="absolute bottom-2 left-2 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">Only ' + offer.stock + ' left</span>' : '') +
        '</a>' +
        '<div class="flex flex-1 flex-col px-1 pb-1 pt-2.5">' +
          '<p class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">' + ui.esc(product.brand) + ' · ' + ui.esc(product.unit) + '</p>' +
          '<a href="product.html?id=' + encodeURIComponent(product.id) + '" class="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-ink hover:text-brand">' + ui.esc(product.name) + '</a>' +
          '<div class="mt-auto pt-2">' +
            '<div class="flex items-baseline gap-1.5">' +
              '<span class="text-base font-extrabold text-brand">' + ui.money(offer.price) + '</span>' +
              (offer.mrp > offer.price ? '<span class="text-[11px] text-slate-400 line-through">' + ui.money(offer.mrp) + '</span>' : '') +
            '</div>' +
            (available
              ? (line
                  ? '<div class="mt-2 flex justify-center"><div class="qty-stepper" data-product-id="' + product.id + '" data-seller-id="' + seller.id + '">' +
                      '<button type="button" data-action="dec" aria-label="Decrease quantity">−</button>' +
                      '<span>' + line.qty + '</span>' +
                      '<button type="button" data-action="inc" aria-label="Increase quantity">+</button>' +
                    '</div></div>'
                  : '<button type="button" data-action="add" data-product-id="' + product.id + '" data-seller-id="' + seller.id + '" ' +
                      'class="mt-2 w-full rounded-lg bg-brand-light py-2 text-xs font-bold text-brand transition hover:bg-brand hover:text-white">Add to cart</button>')
              : '<p class="mt-2 rounded-lg bg-slate-100 py-2 text-center text-xs font-bold text-slate-400">Out of stock</p>') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderProducts() {
    document.getElementById('shopProductCount').textContent =
      products.length + (products.length === 1 ? ' product' : ' products') + ' available · prices set by the seller';
    document.getElementById('shopProducts').innerHTML = products.map(productCard).join('');
    ui.refreshIcons();
  }

  document.getElementById('shopProducts').addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]');
    if (!btn) return;
    var holder = btn.closest('[data-product-id][data-seller-id]') || btn;
    var productId = holder.getAttribute('data-product-id');
    var sellerId = holder.getAttribute('data-seller-id');
    var action = btn.getAttribute('data-action');
    var line = Store.getCartLine(productId, sellerId);

    if (action === 'add') {
      if (Store.addToCart(productId, sellerId, 1)) {
        ui.toast('Added to cart');
      }
    } else if (action === 'inc') {
      Store.setQty(productId, sellerId, (line ? line.qty : 0) + 1);
    } else if (action === 'dec') {
      Store.setQty(productId, sellerId, (line ? line.qty : 0) - 1);
    }
  });

  Store.onChange(renderProducts);

  renderHero();
  renderProducts();
})();
