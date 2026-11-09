/* Home page */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('home');

  var categories = Store.getCategories();
  var sellers = Store.getSellers();
  var products = Store.getProducts();

  /* Categories */
  document.getElementById('categoryRow').innerHTML = categories.map(function (category) {
    return '' +
      '<a href="products.html?category=' + encodeURIComponent(category.name) + '" ' +
        'class="group flex min-w-[6.5rem] flex-col items-center gap-2 rounded-2xl border border-emerald-900/10 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md">' +
        '<span class="emoji-tile h-12 w-12 text-2xl transition group-hover:scale-110">' + ui.esc(category.emoji) + '</span>' +
        '<span class="text-center text-xs font-bold text-ink">' + ui.esc(category.name) + '</span>' +
      '</a>';
  }).join('');

  /* Popular shops — highest rated first */
  var popularShops = sellers.slice().sort(function (a, b) { return b.rating - a.rating; });
  document.getElementById('shopGrid').innerHTML = popularShops.map(function (seller) {
    return ui.shopCard(seller);
  }).join('');

  /* Best deals */
  var deals = products
    .map(function (product) {
      var best = Store.availableOffers(product)[0];
      return { product: product, discount: best ? ui.discountPercent(best.mrp, best.price) : 0 };
    })
    .filter(function (entry) { return entry.discount > 0; })
    .sort(function (a, b) { return b.discount - a.discount; })
    .slice(0, 8)
    .map(function (entry) { return entry.product; });
  document.getElementById('dealGrid').innerHTML = deals.map(function (product) {
    return ui.productCard(product);
  }).join('');

  /* Popular products — multi-seller products first */
  var popular = products.slice().sort(function (a, b) {
    return Store.availableOffers(b).length - Store.availableOffers(a).length;
  }).slice(0, 8);
  document.getElementById('productGrid').innerHTML = popular.map(function (product) {
    return ui.productCard(product);
  }).join('');

  /* Recently added */
  var recent = products.slice().sort(function (a, b) {
    return String(b.addedAt || '').localeCompare(String(a.addedAt || ''));
  }).slice(0, 4);
  document.getElementById('recentGrid').innerHTML = recent.map(function (product) {
    return ui.productCard(product);
  }).join('');

  /* Hero search */
  var heroSearch = document.getElementById('heroSearch');
  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var q = (heroSearch.querySelector('input[name="q"]').value || '').trim();
      window.location.href = 'products.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }

  ui.refreshIcons();
})();
