/* Product catalog */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('products');

  var categories = Store.getCategories();
  var products = Store.getProducts();
  var state = {
    q: (ui.qs('q') || '').trim(),
    category: ui.qs('category') || 'All',
    sort: ui.qs('sort') || 'relevance'
  };

  var chipsEl = document.getElementById('filterChips');
  var gridEl = document.getElementById('productGrid');
  var countEl = document.getElementById('resultCount');
  var searchInput = document.getElementById('searchInput');
  var sortSelect = document.getElementById('sortSelect');
  var clearBtn = document.getElementById('clearFilters');
  var searchForm = document.getElementById('pageSearch');

  if (searchInput) searchInput.value = state.q;
  if (sortSelect) sortSelect.value = state.sort;

  function renderChips() {
    var items = ['All'].concat(categories.map(function (c) { return c.name; }));
    chipsEl.innerHTML = items.map(function (name) {
      var active = state.category === name;
      var params = [];
      if (name !== 'All') params.push('category=' + encodeURIComponent(name));
      if (state.q) params.push('q=' + encodeURIComponent(state.q));
      return '<a href="products.html' + (params.length ? '?' + params.join('&') : '') + '" ' +
        'class="shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ' +
        (active ? 'bg-brand text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-emerald-900/10 hover:bg-brand-light hover:text-brand') + '">' +
        ui.esc(name) + '</a>';
    }).join('');
  }

  function matches(product) {
    if (state.category !== 'All' && product.category !== state.category) return false;
    if (!state.q) return true;
    var needle = state.q.toLowerCase();
    var haystack = [
      product.name,
      product.brand,
      product.category,
      product.unit,
      product.description
    ].join(' ').toLowerCase();
    return haystack.indexOf(needle) !== -1;
  }

  function priceOf(product) {
    var best = Store.availableOffers(product)[0];
    return best ? best.price : Infinity;
  }

  function discountOf(product) {
    var best = Store.availableOffers(product)[0];
    return best ? ui.discountPercent(best.mrp, best.price) : 0;
  }

  function sorted(list) {
    var copy = list.slice();
    switch (state.sort) {
      case 'price-low':
        copy.sort(function (a, b) { return priceOf(a) - priceOf(b); });
        break;
      case 'price-high':
        copy.sort(function (a, b) { return priceOf(b) - priceOf(a); });
        break;
      case 'discount':
        copy.sort(function (a, b) { return discountOf(b) - discountOf(a); });
        break;
      case 'new':
        copy.sort(function (a, b) { return String(b.addedAt || '').localeCompare(String(a.addedAt || '')); });
        break;
      case 'name':
        copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
        break;
      default:
        copy.sort(function (a, b) {
          return Store.availableOffers(b).length - Store.availableOffers(a).length;
        });
    }
    return copy;
  }

  function render() {
    renderChips();

    var list = sorted(products.filter(matches));
    countEl.textContent = list.length + (list.length === 1 ? ' product' : ' products') +
      (state.category !== 'All' ? ' in ' + state.category : '') +
      (state.q ? ' for “' + state.q + '”' : '');

    var hasFilters = state.q || state.category !== 'All' || state.sort !== 'relevance';
    clearBtn.classList.toggle('hidden', !hasFilters);

    if (!list.length) {
      gridEl.innerHTML = ui.emptyState(
        'search-x',
        'No products found',
        'Try a different search term or browse another category.',
        '<button type="button" id="emptyClear" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">Clear filters</button>'
      );
      var emptyClear = document.getElementById('emptyClear');
      if (emptyClear) emptyClear.addEventListener('click', clearFilters);
    } else {
      gridEl.innerHTML = list.map(function (product) {
        return ui.productCard(product);
      }).join('');
    }
    ui.refreshIcons();
  }

  function clearFilters() {
    state.q = '';
    state.category = 'All';
    state.sort = 'relevance';
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = 'relevance';
    window.history.replaceState({}, '', 'products.html');
    render();
  }

  var debounce = null;
  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      state.q = (searchInput.value || '').trim();
      render();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        state.q = (searchInput.value || '').trim();
        render();
      }, 180);
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      render();
    });
  }
  if (clearBtn) clearBtn.addEventListener('click', clearFilters);

  render();
})();
