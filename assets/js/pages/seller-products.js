/* Seller product management — prices, stock, availability */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;
  var shell = window.GS.seller.mount('products');

  var sellerId = shell.sellerId;
  var seller = shell.seller;
  var root = document.getElementById('sellerProducts');
  var filtersEl = document.getElementById('sellerProductFilters');
  var countEl = document.getElementById('sellerProductCount');
  var subtitleEl = document.getElementById('sellerProductsSubtitle');
  var searchForm = document.getElementById('sellerProductSearch');
  var searchInput = document.getElementById('sellerProductQuery');
  var addBtn = document.getElementById('addProductBtn');

  var state = { filter: 'all', q: '' };

  var FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'low', label: 'Low stock' },
    { key: 'out', label: 'Out of stock' },
    { key: 'hidden', label: 'Hidden' }
  ];

  var FIELD_CLASS = 'mt-1 w-full rounded-xl border border-emerald-900/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15';

  function matchesFilter(entry, filter) {
    var offer = entry.offer;
    if (filter === 'low') return offer.available && offer.stock > 0 && offer.stock <= 5;
    if (filter === 'out') return !offer.available || offer.stock <= 0;
    if (filter === 'hidden') return !offer.available;
    return true;
  }

  function matchesQuery(entry) {
    if (!state.q) return true;
    var needle = state.q.toLowerCase();
    var product = entry.product;
    return [product.name, product.brand, product.category, product.unit]
      .join(' ').toLowerCase().indexOf(needle) !== -1;
  }

  function filterCount(filter) {
    return window.GS.seller.sellerOffers(sellerId).filter(function (entry) {
      return matchesFilter(entry, filter);
    }).length;
  }

  function renderFilters() {
    filtersEl.innerHTML = FILTERS.map(function (filter) {
      var active = state.filter === filter.key;
      var count = filterCount(filter.key);
      return '<button type="button" data-filter="' + filter.key + '" class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ' +
        (active ? 'bg-brand text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-emerald-900/10 hover:bg-brand-light hover:text-brand') + '">' +
        ui.esc(filter.label) +
        '<span class="rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ' +
          (active ? 'bg-white/20 text-white' : 'bg-canvas text-slate-500') + '">' + count + '</span>' +
      '</button>';
    }).join('');
  }

  function productRow(entry) {
    var product = entry.product;
    var offer = entry.offer;
    var out = !offer.available || offer.stock <= 0;
    var low = offer.available && offer.stock > 0 && offer.stock <= 5;
    var discount = ui.discountPercent(offer.mrp, offer.price);

    return '' +
      '<div class="rounded-2xl border border-emerald-900/10 bg-white p-4">' +
        '<div class="flex items-start gap-3">' +
          '<div class="emoji-tile relative h-14 w-14 shrink-0 text-2xl">' + ui.esc(product.emoji) +
            (discount ? '<span class="discount-pill absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[9px]">' + discount + '%</span>' : '') +
          '</div>' +
          '<div class="min-w-0 flex-1">' +
            '<div class="flex flex-wrap items-start justify-between gap-2">' +
              '<div class="min-w-0">' +
                '<p class="truncate text-sm font-extrabold text-ink">' + ui.esc(product.name) + '</p>' +
                '<p class="text-[11px] text-slate-400">' + ui.esc(product.brand) + ' · ' + ui.esc(product.unit) + ' · ' + ui.esc(product.category) + '</p>' +
              '</div>' +
              '<span class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ' +
                (offer.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500') + '">' +
                (offer.available ? 'Visible' : 'Hidden') +
              '</span>' +
            '</div>' +

            '<div class="mt-3 grid grid-cols-3 gap-2 text-center">' +
              '<div class="rounded-lg bg-canvas px-2 py-1.5">' +
                '<p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">Price</p>' +
                '<p class="text-xs font-extrabold text-brand">' + ui.money(offer.price) + '</p>' +
              '</div>' +
              '<div class="rounded-lg bg-canvas px-2 py-1.5">' +
                '<p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">MRP</p>' +
                '<p class="text-xs font-extrabold text-slate-500">' + ui.money(offer.mrp) + '</p>' +
              '</div>' +
              '<div class="rounded-lg px-2 py-1.5 ' + (out ? 'bg-rose-50' : low ? 'bg-amber-50' : 'bg-canvas') + '">' +
                '<p class="text-[9px] font-bold uppercase tracking-wide text-slate-400">Stock</p>' +
                '<p class="text-xs font-extrabold ' + (out ? 'text-rose-600' : low ? 'text-amber-700' : 'text-ink') + '">' +
                  (out ? '0' : offer.stock) +
                '</p>' +
              '</div>' +
            '</div>' +

            '<div class="mt-3 flex flex-wrap items-center gap-2">' +
              '<button type="button" data-action="toggle" data-product-id="' + ui.esc(product.id) + '" ' +
                'class="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-600 ring-1 ring-emerald-900/10 transition hover:bg-brand-light hover:text-brand">' +
                '<i data-lucide="' + (offer.available ? 'eye-off' : 'eye') + '" class="h-3.5 w-3.5"></i> ' +
                (offer.available ? 'Hide' : 'Show') +
              '</button>' +
              '<button type="button" data-action="edit" data-product-id="' + ui.esc(product.id) + '" ' +
                'class="inline-flex items-center gap-1 rounded-lg bg-brand-light px-2.5 py-1.5 text-[11px] font-bold text-brand transition hover:bg-brand hover:text-white">' +
                '<i data-lucide="pencil" class="h-3.5 w-3.5"></i> Edit' +
              '</button>' +
              '<button type="button" data-action="remove" data-product-id="' + ui.esc(product.id) + '" ' +
                'class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">' +
                '<i data-lucide="trash-2" class="h-3.5 w-3.5"></i> Remove' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function render() {
    renderFilters();

    var all = window.GS.seller.sellerOffers(sellerId);
    var entries = all.filter(function (entry) {
      return matchesFilter(entry, state.filter) && matchesQuery(entry);
    });

    var low = all.filter(function (entry) { return matchesFilter(entry, 'low'); }).length;
    subtitleEl.textContent = all.length + ' products listed · ' + low + ' low on stock · prices set by you';

    countEl.textContent = entries.length + (entries.length === 1 ? ' product' : ' products') +
      (state.filter !== 'all' ? ' · ' + (FILTERS.find(function (f) { return f.key === state.filter; }) || {}).label : '') +
      (state.q ? ' for “' + state.q + '”' : '');

    if (!entries.length) {
      root.innerHTML = ui.emptyState(
        'package-search',
        'No products found',
        all.length ? 'Try a different filter or search term.' : 'Add your first product to start selling on GoScoot.',
        '<button type="button" data-action="add" class="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white">Add product</button>'
      );
      ui.refreshIcons();
      return;
    }

    root.innerHTML = entries.map(productRow).join('');
    ui.refreshIcons();
  }

  /* ---------- modal ---------- */

  function ensureModal() {
    var modal = document.getElementById('productModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'productModal';
    modal.className = 'fixed inset-0 z-[80] hidden items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4';
    modal.innerHTML = '<div id="productModalCard" class="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6"></div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
    });

    return modal;
  }

  function closeModal() {
    var modal = document.getElementById('productModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function field(id, label, value, opts) {
    opts = opts || {};
    var control;
    if (opts.select) {
      control = '<select id="' + id + '" name="' + id + '" class="' + FIELD_CLASS + '">' +
        opts.select.map(function (option) {
          return '<option value="' + ui.esc(option) + '"' + (option === value ? ' selected' : '') + '>' + ui.esc(option) + '</option>';
        }).join('') +
      '</select>';
    } else if (opts.textarea) {
      control = '<textarea id="' + id + '" name="' + id + '" rows="2" class="' + FIELD_CLASS + ' resize-none" placeholder="' + ui.esc(opts.placeholder || '') + '">' + ui.esc(value || '') + '</textarea>';
    } else {
      control = '<input id="' + id + '" name="' + id + '" type="' + (opts.type || 'text') + '" ' +
        (opts.inputmode ? 'inputmode="' + opts.inputmode + '" ' : '') +
        'value="' + ui.esc(value == null ? '' : value) + '" ' +
        'class="' + FIELD_CLASS + '" placeholder="' + ui.esc(opts.placeholder || '') + '">';
    }
    return '<div><label for="' + id + '" class="text-xs font-bold text-slate-600">' + ui.esc(label) + '</label>' + control + '</div>';
  }

  function openAddModal() {
    var categories = Store.getCategories().map(function (c) { return c.name; });
    var defaultCategory = categories.indexOf(seller.category) !== -1 ? seller.category : (categories[0] || 'Grocery');
    var modal = ensureModal();
    var card = document.getElementById('productModalCard');

    card.innerHTML = '' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div>' +
          '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Add a product</h2>' +
          '<p class="mt-0.5 text-xs text-slate-500">This listing will be sold and packed by ' + ui.esc(seller.name) + '.</p>' +
        '</div>' +
        '<button type="button" data-close class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Close">' +
          '<i data-lucide="x" class="h-4 w-4"></i>' +
        '</button>' +
      '</div>' +

      '<form id="productForm" class="mt-4 space-y-3.5" novalidate>' +
        '<div class="grid gap-3.5 sm:grid-cols-2">' +
          field('pf-name', 'Product name', '', { placeholder: 'e.g. Fresh Coriander' }) +
          field('pf-brand', 'Brand', '', { placeholder: 'e.g. Farm Fresh' }) +
        '</div>' +
        '<div class="grid gap-3.5 sm:grid-cols-2">' +
          field('pf-unit', 'Unit / pack size', '', { placeholder: 'e.g. 250 g' }) +
          field('pf-category', 'Category', defaultCategory, { select: categories }) +
        '</div>' +
        '<div class="grid gap-3.5 sm:grid-cols-2">' +
          field('pf-emoji', 'Emoji', '📦', { placeholder: '📦' }) +
          field('pf-stock', 'Stock', '10', { type: 'number', inputmode: 'numeric' }) +
        '</div>' +
        '<div class="grid gap-3.5 sm:grid-cols-2">' +
          field('pf-price', 'Selling price (₹)', '', { type: 'number', inputmode: 'decimal' }) +
          field('pf-mrp', 'MRP (₹)', '', { type: 'number', inputmode: 'decimal' }) +
        '</div>' +
        field('pf-description', 'Short description', '', { textarea: true, placeholder: 'What makes this product good?' }) +
        '<div id="productFormError" class="hidden rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-600"></div>' +
        '<div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">' +
          '<button type="button" data-close class="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-canvas">Cancel</button>' +
          '<button type="submit" class="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark">Add product</button>' +
        '</div>' +
      '</form>';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    ui.refreshIcons();

    card.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    card.querySelector('#productForm').addEventListener('submit', function (event) {
      event.preventDefault();
      submitAdd(card);
    });
    var nameInput = card.querySelector('#pf-name');
    if (nameInput) nameInput.focus();
  }

  function submitAdd(card) {
    var name = card.querySelector('#pf-name').value.trim();
    var brand = card.querySelector('#pf-brand').value.trim() || 'Local';
    var unit = card.querySelector('#pf-unit').value.trim() || '1 unit';
    var category = card.querySelector('#pf-category').value;
    var emoji = card.querySelector('#pf-emoji').value.trim() || '📦';
    var price = Number(card.querySelector('#pf-price').value);
    var mrp = Number(card.querySelector('#pf-mrp').value);
    var stock = parseInt(card.querySelector('#pf-stock').value, 10);
    var description = card.querySelector('#pf-description').value.trim();

    var error = '';
    if (name.length < 2) error = 'Please enter a product name.';
    else if (!isFinite(price) || price <= 0) error = 'Selling price must be greater than zero.';
    else if (!isFinite(mrp) || mrp < price) error = 'MRP must be equal to or greater than the selling price.';
    else if (!isFinite(stock) || stock < 0) error = 'Stock must be zero or more.';

    var errorEl = card.querySelector('#productFormError');
    if (error) {
      errorEl.textContent = error;
      errorEl.classList.remove('hidden');
      return;
    }

    var products = Store.getProducts();
    var maxId = 0;
    products.forEach(function (product) {
      var match = /^product_(\d+)$/.exec(product.id);
      if (match) maxId = Math.max(maxId, parseInt(match[1], 10));
    });

    products.unshift({
      id: 'product_' + String(maxId + 1).padStart(3, '0'),
      name: name,
      brand: brand,
      unit: unit,
      category: category,
      emoji: emoji,
      description: description || 'Added by ' + seller.name + ' in the seller demo.',
      addedAt: new Date().toISOString().slice(0, 10),
      offers: [{
        sellerId: sellerId,
        price: Math.round(price),
        mrp: Math.round(mrp),
        available: true,
        stock: stock
      }]
    });

    Store.saveProducts(products);
    closeModal();
    ui.toast('Product added');
  }

  function openEditModal(productId) {
    var product = Store.getProduct(productId);
    var offer = product ? Store.getOffer(product, sellerId) : null;
    if (!product || !offer) return;

    var modal = ensureModal();
    var card = document.getElementById('productModalCard');

    card.innerHTML = '' +
      '<div class="flex items-start justify-between gap-3">' +
        '<div>' +
          '<h2 class="font-display text-lg font-extrabold tracking-tight text-ink">Edit listing</h2>' +
          '<p class="mt-0.5 text-xs text-slate-500">Update the price, stock and visibility for this shop.</p>' +
        '</div>' +
        '<button type="button" data-close class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canvas text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Close">' +
          '<i data-lucide="x" class="h-4 w-4"></i>' +
        '</button>' +
      '</div>' +

      '<div class="mt-4 flex items-center gap-3 rounded-xl bg-canvas p-3">' +
        '<div class="emoji-tile h-12 w-12 shrink-0 text-xl">' + ui.esc(product.emoji) + '</div>' +
        '<div class="min-w-0">' +
          '<p class="truncate text-sm font-extrabold text-ink">' + ui.esc(product.name) + '</p>' +
          '<p class="text-[11px] text-slate-400">' + ui.esc(product.brand) + ' · ' + ui.esc(product.unit) + '</p>' +
        '</div>' +
      '</div>' +

      '<form id="productForm" class="mt-4 space-y-3.5" novalidate>' +
        '<div class="grid gap-3.5 sm:grid-cols-2">' +
          field('pf-price', 'Selling price (₹)', offer.price, { type: 'number', inputmode: 'decimal' }) +
          field('pf-mrp', 'MRP (₹)', offer.mrp, { type: 'number', inputmode: 'decimal' }) +
        '</div>' +
        '<div class="grid gap-3.5 sm:grid-cols-2">' +
          field('pf-stock', 'Stock', offer.stock, { type: 'number', inputmode: 'numeric' }) +
          '<div class="flex items-end pb-1">' +
            '<label class="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">' +
              '<input id="pf-available" type="checkbox" class="h-4 w-4 rounded border-emerald-900/20 text-brand focus:ring-brand"' + (offer.available ? ' checked' : '') + '>' +
              'Visible to customers' +
            '</label>' +
          '</div>' +
        '</div>' +
        '<div id="productFormError" class="hidden rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-600"></div>' +
        '<div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">' +
          '<button type="button" data-close class="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-canvas">Cancel</button>' +
          '<button type="submit" class="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark">Save changes</button>' +
        '</div>' +
      '</form>';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    ui.refreshIcons();

    card.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    card.querySelector('#productForm').addEventListener('submit', function (event) {
      event.preventDefault();
      submitEdit(card, productId);
    });
    var priceInput = card.querySelector('#pf-price');
    if (priceInput) priceInput.focus();
  }

  function submitEdit(card, productId) {
    var price = Number(card.querySelector('#pf-price').value);
    var mrp = Number(card.querySelector('#pf-mrp').value);
    var stock = parseInt(card.querySelector('#pf-stock').value, 10);
    var available = card.querySelector('#pf-available').checked;

    var error = '';
    if (!isFinite(price) || price <= 0) error = 'Selling price must be greater than zero.';
    else if (!isFinite(mrp) || mrp < price) error = 'MRP must be equal to or greater than the selling price.';
    else if (!isFinite(stock) || stock < 0) error = 'Stock must be zero or more.';

    var errorEl = card.querySelector('#productFormError');
    if (error) {
      errorEl.textContent = error;
      errorEl.classList.remove('hidden');
      return;
    }

    var products = Store.getProducts();
    var product = products.find(function (p) { return p.id === productId; });
    var offer = product && product.offers.find(function (o) { return o.sellerId === sellerId; });
    if (!offer) return;

    offer.price = Math.round(price);
    offer.mrp = Math.round(mrp);
    offer.stock = stock;
    offer.available = available;

    Store.saveProducts(products);
    closeModal();
    ui.toast('Listing updated');
  }

  /* ---------- actions ---------- */

  function toggleProduct(productId) {
    var products = Store.getProducts();
    var product = products.find(function (p) { return p.id === productId; });
    var offer = product && product.offers.find(function (o) { return o.sellerId === sellerId; });
    if (!offer) return;

    offer.available = !offer.available;
    if (offer.available && offer.stock <= 0) offer.stock = 1;

    Store.saveProducts(products);
    ui.toast(offer.available ? 'Product is now visible' : 'Product hidden from customers');
  }

  function removeProduct(productId) {
    var product = Store.getProduct(productId);
    if (!product) return;
    if (!window.confirm('Remove "' + product.name + '" from your shop?')) return;

    var products = Store.getProducts();
    var target = products.find(function (p) { return p.id === productId; });
    if (!target) return;

    target.offers = target.offers.filter(function (o) { return o.sellerId !== sellerId; });
    if (!target.offers.length) {
      products = products.filter(function (p) { return p.id !== productId; });
    }

    Store.saveProducts(products);
    ui.toast('Product removed');
  }

  /* ---------- bindings ---------- */

  filtersEl.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-filter]');
    if (!btn) return;
    state.filter = btn.getAttribute('data-filter');
    render();
  });

  root.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var productId = btn.getAttribute('data-product-id');

    if (action === 'add') openAddModal();
    else if (action === 'edit') openEditModal(productId);
    else if (action === 'toggle') toggleProduct(productId);
    else if (action === 'remove') removeProduct(productId);
  });

  if (addBtn) addBtn.addEventListener('click', openAddModal);

  var debounce = null;
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        state.q = searchInput.value.trim();
        render();
      }, 160);
    });
  }
  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      state.q = (searchInput.value || '').trim();
      render();
    });
  }

  Store.onChange(render);
  render();
})();
