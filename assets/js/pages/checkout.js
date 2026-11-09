/* Checkout */
(function () {
  'use strict';

  var Store = window.GS.Store;
  var ui = window.GS.ui;

  ui.initPage('checkout');

  var root = document.getElementById('checkoutRoot');
  var fillBtn = document.getElementById('fillDemo');
  var summary = Store.getCartSummary();

  var FIELD_CLASS = 'mt-1 w-full rounded-xl border border-emerald-900/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15';

  function field(name, label, opts) {
    opts = opts || {};
    var control;
    if (opts.textarea) {
      control = '<textarea id="f-' + name + '" name="' + name + '" rows="' + (opts.rows || 3) + '" ' +
        'class="' + FIELD_CLASS + ' resize-none" placeholder="' + ui.esc(opts.placeholder || '') + '"' +
        (opts.required ? ' required' : '') + '></textarea>';
    } else {
      control = '<input id="f-' + name + '" name="' + name + '" type="' + (opts.type || 'text') + '" ' +
        'inputmode="' + (opts.inputmode || 'text') + '" maxlength="' + (opts.maxlength || 120) + '" ' +
        'class="' + FIELD_CLASS + '" placeholder="' + ui.esc(opts.placeholder || '') + '"' +
        (opts.required ? ' required' : '') + '>';
    }
    return '' +
      '<div>' +
        '<label for="f-' + name + '" class="text-xs font-bold text-slate-600">' + ui.esc(label) +
          (opts.required ? ' <span class="text-rose-500">*</span>' : '') + '</label>' +
        control +
        '<p class="mt-1 hidden text-[11px] font-semibold text-rose-500" data-error-for="' + name + '"></p>' +
      '</div>';
  }

  function renderEmpty() {
    if (fillBtn) fillBtn.style.display = 'none';
    root.innerHTML = ui.emptyState(
      'shopping-cart',
      'Your cart is empty',
      'Add a few items from local shops before checking out.',
      '<a href="products.html" class="mt-4 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">Browse products</a>'
    );
    ui.refreshIcons();
  }

  function renderCheckout() {
    root.innerHTML = '' +
      '<form id="checkoutForm" class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start" novalidate>' +
        '<div class="space-y-4">' +
          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-5">' +
            '<div class="flex items-center gap-2">' +
              '<span class="grid h-7 w-7 place-items-center rounded-lg bg-brand-light text-brand"><i data-lucide="user" class="h-4 w-4"></i></span>' +
              '<h2 class="font-display text-base font-extrabold text-ink">Contact details</h2>' +
            '</div>' +
            '<div class="mt-4 grid gap-4 sm:grid-cols-2">' +
              field('name', 'Full name', { required: true, placeholder: 'e.g. Aarav Mehta' }) +
              field('phone', 'Mobile number', { required: true, type: 'tel', inputmode: 'numeric', maxlength: 10, placeholder: '10-digit mobile number' }) +
            '</div>' +
          '</div>' +

          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-5">' +
            '<div class="flex items-center gap-2">' +
              '<span class="grid h-7 w-7 place-items-center rounded-lg bg-brand-light text-brand"><i data-lucide="map-pin" class="h-4 w-4"></i></span>' +
              '<h2 class="font-display text-base font-extrabold text-ink">Delivery address</h2>' +
            '</div>' +
            '<div class="mt-4 space-y-4">' +
              field('address', 'Full address', { required: true, textarea: true, rows: 2, placeholder: 'House / flat, street, area, city' }) +
              '<div class="grid gap-4 sm:grid-cols-2">' +
                field('landmark', 'Landmark', { placeholder: 'e.g. Opposite Bank of Baroda' }) +
                field('instructions', 'Delivery instructions', { placeholder: 'e.g. Call on arrival' }) +
              '</div>' +
            '</div>' +
          '</div>' +

          '<div class="rounded-2xl border border-emerald-900/10 bg-white p-5">' +
            '<div class="flex items-center gap-2">' +
              '<span class="grid h-7 w-7 place-items-center rounded-lg bg-brand-light text-brand"><i data-lucide="wallet" class="h-4 w-4"></i></span>' +
              '<h2 class="font-display text-base font-extrabold text-ink">Payment method</h2>' +
            '</div>' +
            '<div class="mt-4 grid gap-3 sm:grid-cols-2">' +
              '<label class="cursor-pointer">' +
                '<input type="radio" name="payment" value="COD" class="peer sr-only" checked>' +
                '<div class="rounded-xl border border-emerald-900/10 bg-white p-3 transition peer-checked:border-brand peer-checked:bg-brand-light peer-checked:ring-2 peer-checked:ring-brand/20">' +
                  '<div class="flex items-center gap-2">' +
                    '<i data-lucide="banknote" class="h-4 w-4 text-brand"></i>' +
                    '<p class="text-sm font-bold text-ink">Cash on delivery</p>' +
                  '</div>' +
                  '<p class="mt-1 text-[11px] text-slate-500">Pay the delivery partner when your order arrives.</p>' +
                '</div>' +
              '</label>' +
              '<label class="cursor-pointer">' +
                '<input type="radio" name="payment" value="Online" class="peer sr-only">' +
                '<div class="rounded-xl border border-emerald-900/10 bg-white p-3 transition peer-checked:border-brand peer-checked:bg-brand-light peer-checked:ring-2 peer-checked:ring-brand/20">' +
                  '<div class="flex items-center gap-2">' +
                    '<i data-lucide="credit-card" class="h-4 w-4 text-brand"></i>' +
                    '<p class="text-sm font-bold text-ink">Online payment</p>' +
                  '</div>' +
                  '<p class="mt-1 text-[11px] text-slate-500">Simulated for this demo — no money is charged.</p>' +
                '</div>' +
              '</label>' +
            '</div>' +
            '<p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">' +
              'Demo checkout: no OTP, no payment gateway. Placing an order only saves it in your browser.' +
            '</p>' +
          '</div>' +
        '</div>' +

        '<aside class="rounded-2xl border border-emerald-900/10 bg-white p-5 lg:sticky lg:top-24">' +
          '<div class="flex items-center justify-between">' +
            '<h2 class="font-display text-base font-extrabold text-ink">Your order</h2>' +
            '<a href="cart.html" class="text-[11px] font-bold text-brand hover:underline">Edit cart</a>' +
          '</div>' +
          '<div class="mt-4 space-y-4">' +
            summary.groups.map(function (group) {
              return '<div>' +
                '<p class="flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><i data-lucide="store" class="h-3.5 w-3.5 text-brand"></i>' + ui.esc(group.seller.name) + '</p>' +
                '<div class="mt-2 space-y-1.5">' +
                  group.lines.map(function (line) {
                    return '<div class="flex items-start justify-between gap-2 text-xs">' +
                      '<span class="text-slate-500"><span class="font-bold text-ink">' + line.qty + '×</span> ' + ui.esc(line.product.name) + '</span>' +
                      '<span class="shrink-0 font-semibold text-ink">' + ui.money(line.lineTotal) + '</span>' +
                    '</div>';
                  }).join('') +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
          '<div class="mt-4 space-y-2 border-t border-dashed border-emerald-900/15 pt-4 text-sm">' +
            '<div class="flex items-center justify-between"><span class="text-slate-500">Subtotal</span><span class="font-semibold text-ink">' + ui.money(summary.subtotal) + '</span></div>' +
            '<div class="flex items-center justify-between"><span class="text-slate-500">Delivery</span><span class="font-semibold text-ink">' + ui.money(summary.delivery) + '</span></div>' +
            '<div class="flex items-center justify-between"><span class="text-slate-500">Service fee</span><span class="font-semibold text-ink">' + ui.money(summary.serviceFee) + '</span></div>' +
          '</div>' +
          '<div class="mt-3 flex items-center justify-between border-t border-emerald-900/10 pt-3">' +
            '<span class="font-display text-base font-extrabold text-ink">Total</span>' +
            '<span class="font-display text-xl font-extrabold text-brand">' + ui.money(summary.grandTotal) + '</span>' +
          '</div>' +
          '<div id="formError" class="mt-3 hidden rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-600"></div>' +
          '<button type="submit" class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-dark">' +
            '<i data-lucide="check-circle-2" class="h-4 w-4"></i> Place order' +
          '</button>' +
          '<p class="mt-3 text-center text-[10px] leading-relaxed text-slate-400">' +
            'By placing this demo order you agree that nothing will actually be charged or delivered.' +
          '</p>' +
        '</aside>' +
      '</form>';

    ui.refreshIcons();
    bindForm();
  }

  function bindForm() {
    var form = document.getElementById('checkoutForm');
    if (!form) return;

    var phone = form.querySelector('#f-phone');
    if (phone) {
      phone.addEventListener('input', function () {
        phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var data = {
        name: form.querySelector('#f-name').value.trim(),
        phone: form.querySelector('#f-phone').value.trim(),
        address: form.querySelector('#f-address').value.trim(),
        landmark: form.querySelector('#f-landmark').value.trim(),
        instructions: form.querySelector('#f-instructions').value.trim(),
        payment: (form.querySelector('input[name="payment"]:checked') || {}).value || 'COD'
      };

      var errors = {};
      if (data.name.length < 2) errors.name = 'Please enter your full name.';
      if (!/^\d{10}$/.test(data.phone)) errors.phone = 'Enter a valid 10-digit mobile number.';
      if (data.address.length < 10) errors.address = 'Please enter a complete delivery address.';

      form.querySelectorAll('[data-error-for]').forEach(function (el) {
        el.textContent = '';
        el.classList.add('hidden');
      });
      form.querySelectorAll('input, textarea').forEach(function (el) {
        el.classList.remove('border-rose-400', 'ring-2', 'ring-rose-100');
      });

      var firstInvalid = null;
      Object.keys(errors).forEach(function (key) {
        var errorEl = form.querySelector('[data-error-for="' + key + '"]');
        var inputEl = form.querySelector('#f-' + key);
        if (errorEl) {
          errorEl.textContent = errors[key];
          errorEl.classList.remove('hidden');
        }
        if (inputEl) {
          inputEl.classList.add('border-rose-400', 'ring-2', 'ring-rose-100');
          if (!firstInvalid) firstInvalid = inputEl;
        }
      });

      var formError = document.getElementById('formError');
      if (Object.keys(errors).length) {
        if (formError) {
          formError.textContent = 'Please fix the highlighted fields to place your order.';
          formError.classList.remove('hidden');
        }
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus({ preventScroll: true });
        }
        return;
      }

      try {
        var order = Store.placeOrder({
          name: data.name,
          phone: data.phone,
          address: data.address,
          landmark: data.landmark,
          instructions: data.instructions
        }, data.payment);
        window.location.href = 'order-confirmation.html?id=' + encodeURIComponent(order.id);
      } catch (err) {
        if (formError) {
          formError.textContent = err.message || 'Could not place your order.';
          formError.classList.remove('hidden');
        }
      }
    });
  }

  if (fillBtn) {
    fillBtn.addEventListener('click', function () {
      var form = document.getElementById('checkoutForm');
      if (!form) return;
      form.querySelector('#f-name').value = 'Aarav Mehta';
      form.querySelector('#f-phone').value = '9876543210';
      form.querySelector('#f-address').value = '12/4, Aliganj Main Road, near Nari Shiksha Kendra, Lucknow';
      form.querySelector('#f-landmark').value = 'Opposite Bank of Baroda';
      form.querySelector('#f-instructions').value = 'Please ring the bell twice.';
      ui.toast('Demo details filled');
    });
  }

  if (!summary.groups.length) {
    renderEmpty();
  } else {
    renderCheckout();
  }
})();
