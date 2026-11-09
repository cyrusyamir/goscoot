/* Shop / seller listing */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('shops');

  var categories = Store.getCategories();
  var sellers = Store.getSellers();
  var state = {
    category: ui.qs('category') || 'All',
    sort: 'rating'
  };

  var chipsEl = document.getElementById('filterChips');
  var gridEl = document.getElementById('shopGrid');
  var countEl = document.getElementById('resultCount');
  var sortEl = document.getElementById('sortSelect');

  function renderChips() {
    var items = ['All'].concat(categories.map(function (c) { return c.name; }));
    chipsEl.innerHTML = items.map(function (name) {
      var active = state.category === name;
      return '<a href="shops.html' + (name === 'All' ? '' : '?category=' + encodeURIComponent(name)) + '" ' +
        'class="shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ' +
        (active ? 'bg-brand text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-emerald-900/10 hover:bg-brand-light hover:text-brand') + '">' +
        ui.esc(name) + '</a>';
    }).join('');
  }

  function filtered() {
    var list = sellers.slice();
    if (state.category !== 'All') {
      list = list.filter(function (s) { return s.category === state.category; });
    }
    if (state.sort === 'eta') {
      list.sort(function (a, b) { return a.etaMin - b.etaMin; });
    } else if (state.sort === 'name') {
      list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else {
      list.sort(function (a, b) { return b.rating - a.rating; });
    }
    return list;
  }

  function render() {
    renderChips();
    var list = filtered();
    countEl.textContent = list.length + (list.length === 1 ? ' shop' : ' shops') + ' delivering to you';
    gridEl.innerHTML = list.length
      ? list.map(function (seller) { return ui.shopCard(seller); }).join('')
      : ui.emptyState('store', 'No shops in this category', 'Try another category or browse all local shops.',
          '<a href="shops.html" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">View all shops</a>');
    ui.refreshIcons();
  }

  if (sortEl) {
    sortEl.addEventListener('change', function () {
      state.sort = sortEl.value;
      render();
    });
  }

  render();
})();
