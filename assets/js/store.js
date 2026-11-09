/* GoScoot shared store — the single source of truth for the demo.
 * Persists to localStorage and notifies every listener on change.
 * Loaded after seed.js and before page scripts.
 */
(function () {
  'use strict';

  var KEYS = {
    version: 'gs_version',
    sellers: 'gs_sellers',
    products: 'gs_products',
    orders: 'gs_orders',
    cart: 'gs_cart',
    session: 'gs_session',
    couriers: 'gs_couriers'
  };

  var SEED_VERSION = '3';

  var STATUS_FLOW = [
    'placed',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'picked_up',
    'out_for_delivery',
    'delivered'
  ];

  var STATUS_META = {
    placed: { label: 'Order placed', short: 'Placed', icon: 'receipt-text', tone: 'slate' },
    confirmed: { label: 'Seller confirmed', short: 'Confirmed', icon: 'badge-check', tone: 'blue' },
    preparing: { label: 'Preparing order', short: 'Preparing', icon: 'cooking-pot', tone: 'amber' },
    ready_for_pickup: { label: 'Ready for pickup', short: 'Ready', icon: 'package-check', tone: 'amber' },
    picked_up: { label: 'Picked up by GoScoot', short: 'Picked up', icon: 'package', tone: 'violet' },
    out_for_delivery: { label: 'Out for delivery', short: 'On the way', icon: 'bike', tone: 'violet' },
    delivered: { label: 'Delivered', short: 'Delivered', icon: 'party-popper', tone: 'green' },
    rejected: { label: 'Rejected by seller', short: 'Rejected', icon: 'x-circle', tone: 'red' }
  };

  var listeners = [];

  /* ---------- storage helpers ---------- */

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      console.warn('GoScoot: could not read', key, err);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('GoScoot: could not write', key, err);
    }
  }

  function emit() {
    listeners.slice().forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        console.error('GoScoot listener error', err);
      }
    });
  }

  window.addEventListener('storage', function (event) {
    if (event.key === null || Object.keys(KEYS).some(function (k) { return KEYS[k] === event.key; })) {
      emit();
    }
  });

  /* ---------- init / reset ---------- */

  function init(force) {
    var version = localStorage.getItem(KEYS.version);
    var hasData = localStorage.getItem(KEYS.products) !== null;
    if (force || version !== SEED_VERSION || !hasData) {
      var seed = window.GS_SEED;
      if (!seed) {
        console.error('GoScoot: seed data missing. Load seed.js before store.js.');
        return;
      }
      write(KEYS.sellers, seed.sellers);
      write(KEYS.products, seed.products);
      write(KEYS.orders, seed.orders || []);
      write(KEYS.couriers, seed.couriers || []);
      write(KEYS.cart, []);
      write(KEYS.session, { role: 'customer', location: 'Lucknow', sellerId: 'seller_001' });
      localStorage.setItem(KEYS.version, SEED_VERSION);
    }
  }

  function resetDemo() {
    Object.keys(KEYS).forEach(function (k) {
      localStorage.removeItem(KEYS[k]);
    });
    init(true);
    emit();
  }

  /* ---------- catalog ---------- */

  function getSellers() {
    return read(KEYS.sellers, []);
  }

  function getSeller(id) {
    return getSellers().find(function (s) { return s.id === id; }) || null;
  }

  function getCouriers() {
    return read(KEYS.couriers, []);
  }

  function getCourier(id) {
    return getCouriers().find(function (c) { return c.id === id; }) || null;
  }

  function getProducts() {
    return read(KEYS.products, []);
  }

  function saveProducts(products) {
    write(KEYS.products, products);
    emit();
  }

  function getProduct(id) {
    return getProducts().find(function (p) { return p.id === id; }) || null;
  }

  function getCategories() {
    return (window.GS_SEED && window.GS_SEED.categories) || [];
  }

  function getOffer(product, sellerId) {
    if (!product) return null;
    return product.offers.find(function (o) { return o.sellerId === sellerId; }) || null;
  }

  function availableOffers(product) {
    if (!product) return [];
    return product.offers
      .filter(function (o) { return o.available && o.stock > 0; })
      .slice()
      .sort(function (a, b) { return a.price - b.price; });
  }

  function lowestPrice(product) {
    var offers = availableOffers(product);
    return offers.length ? offers[0].price : null;
  }

  function sellerProducts(sellerId) {
    return getProducts().filter(function (p) {
      return p.offers.some(function (o) { return o.sellerId === sellerId; });
    });
  }

  /* ---------- session ---------- */

  function getSession() {
    return read(KEYS.session, { role: 'customer', location: 'Lucknow', sellerId: 'seller_001' });
  }

  function setSession(patch) {
    var session = Object.assign({}, getSession(), patch || {});
    write(KEYS.session, session);
    emit();
    return session;
  }

  /* ---------- cart ---------- */

  function getCart() {
    return read(KEYS.cart, []);
  }

  function saveCart(cart) {
    write(KEYS.cart, cart);
    emit();
  }

  function addToCart(productId, sellerId, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    var product = getProduct(productId);
    var offer = getOffer(product, sellerId);
    if (!product || !offer || !offer.available || offer.stock <= 0) return false;

    var cart = getCart();
    var line = cart.find(function (l) {
      return l.productId === productId && l.sellerId === sellerId;
    });

    if (line) {
      line.qty = Math.min(line.qty + qty, offer.stock);
    } else {
      cart.push({ productId: productId, sellerId: sellerId, qty: Math.min(qty, offer.stock) });
    }
    saveCart(cart);
    return true;
  }

  function setQty(productId, sellerId, qty) {
    qty = parseInt(qty, 10) || 0;
    var cart = getCart();
    var line = cart.find(function (l) {
      return l.productId === productId && l.sellerId === sellerId;
    });
    if (!line) return;

    if (qty <= 0) {
      cart = cart.filter(function (l) { return l !== line; });
    } else {
      var offer = getOffer(getProduct(productId), sellerId);
      line.qty = Math.min(qty, offer ? offer.stock : qty);
    }
    saveCart(cart);
  }

  function removeLine(productId, sellerId) {
    setQty(productId, sellerId, 0);
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartLine(productId, sellerId) {
    return getCart().find(function (l) {
      return l.productId === productId && l.sellerId === sellerId;
    }) || null;
  }

  function getCartDetailed() {
    var products = getProducts();
    var sellers = getSellers();
    return getCart().map(function (line) {
      var product = products.find(function (p) { return p.id === line.productId; });
      var offer = getOffer(product, line.sellerId);
      var seller = sellers.find(function (s) { return s.id === line.sellerId; });
      if (!product || !offer || !seller) return null;
      return {
        productId: line.productId,
        sellerId: line.sellerId,
        qty: line.qty,
        product: product,
        offer: offer,
        seller: seller,
        lineTotal: offer.price * line.qty
      };
    }).filter(Boolean);
  }

  function getCartGroups() {
    var groups = [];
    getCartDetailed().forEach(function (line) {
      var group = groups.find(function (g) { return g.seller.id === line.sellerId; });
      if (!group) {
        group = { seller: line.seller, lines: [], subtotal: 0, deliveryFee: line.seller.deliveryFee || 0 };
        groups.push(group);
      }
      group.lines.push(line);
      group.subtotal += line.lineTotal;
    });
    return groups;
  }

  function getCartSummary() {
    var groups = getCartGroups();
    var subtotal = 0;
    var delivery = 0;
    var count = 0;
    groups.forEach(function (g) {
      subtotal += g.subtotal;
      delivery += g.deliveryFee;
      g.lines.forEach(function (l) { count += l.qty; });
    });
    var serviceFee = subtotal > 0 ? 10 : 0;
    return {
      groups: groups,
      count: count,
      sellerCount: groups.length,
      subtotal: subtotal,
      delivery: delivery,
      serviceFee: serviceFee,
      grandTotal: subtotal + delivery + serviceFee
    };
  }

  /* ---------- orders ---------- */

  function getOrders() {
    return read(KEYS.orders, []);
  }

  function getOrder(id) {
    return getOrders().find(function (o) { return o.id === id; }) || null;
  }

  function nextOrderId() {
    var max = 10000;
    getOrders().forEach(function (o) {
      var n = parseInt(String(o.id).replace(/\D/g, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return 'GS' + (max + 1);
  }

  function placeOrder(customer, paymentMethod) {
    var summary = getCartSummary();
    if (!summary.groups.length) throw new Error('Your cart is empty.');

    var now = new Date().toISOString();
    var order = {
      id: nextOrderId(),
      createdAt: now,
      customer: customer,
      paymentMethod: paymentMethod || 'COD',
      sellerOrders: summary.groups.map(function (g) {
        return {
          sellerId: g.seller.id,
          items: g.lines.map(function (l) {
            return {
              productId: l.product.id,
              name: l.product.name,
              unit: l.product.unit,
              emoji: l.product.emoji,
              price: l.offer.price,
              qty: l.qty
            };
          }),
          subtotal: g.subtotal,
          deliveryFee: g.deliveryFee,
          status: 'placed',
          history: [{ status: 'placed', at: now }]
        };
      }),
      totals: {
        subtotal: summary.subtotal,
        delivery: summary.delivery,
        serviceFee: summary.serviceFee,
        grandTotal: summary.grandTotal
      }
    };

    // Reduce stock for the purchased offers so the demo feels alive.
    var products = getProducts();
    order.sellerOrders.forEach(function (so) {
      so.items.forEach(function (item) {
        var product = products.find(function (p) { return p.id === item.productId; });
        var offer = getOffer(product, so.sellerId);
        if (offer) offer.stock = Math.max(0, (offer.stock || 0) - item.qty);
      });
    });

    var orders = getOrders();
    orders.unshift(order);
    write(KEYS.orders, orders);
    write(KEYS.products, products);
    write(KEYS.cart, []);
    emit();
    return order;
  }

  function updateSellerOrderStatus(orderId, sellerId, status) {
    if (!STATUS_META[status]) return null;
    var orders = getOrders();
    var order = orders.find(function (o) { return o.id === orderId; });
    if (!order) return null;
    var sellerOrder = order.sellerOrders.find(function (s) { return s.sellerId === sellerId; });
    if (!sellerOrder) return null;

    sellerOrder.status = status;
    sellerOrder.history = sellerOrder.history || [];
    sellerOrder.history.push({ status: status, at: new Date().toISOString() });
    write(KEYS.orders, orders);
    emit();
    return order;
  }

  function advanceCourier(orderId, sellerId) {
    var order = getOrder(orderId);
    if (!order) return null;
    var sellerOrder = order.sellerOrders.find(function (s) { return s.sellerId === sellerId; });
    if (!sellerOrder) return null;
    var index = STATUS_FLOW.indexOf(sellerOrder.status);
    var start = STATUS_FLOW.indexOf('ready_for_pickup');
    if (index < start || index >= STATUS_FLOW.length - 1) return order;
    return updateSellerOrderStatus(orderId, sellerId, STATUS_FLOW[index + 1]);
  }

  function nextPickupTaskId() {
    var max = 1000;
    getOrders().forEach(function (order) {
      order.sellerOrders.forEach(function (so) {
        var n = parseInt(String(so.pickupTaskId || '').replace(/\D/g, ''), 10);
        if (!isNaN(n) && n > max) max = n;
      });
    });
    return 'PKP-' + (max + 1);
  }

  function createPickupTask(orderId, sellerId) {
    var orders = getOrders();
    var order = orders.find(function (o) { return o.id === orderId; });
    if (!order) return null;
    var sellerOrder = order.sellerOrders.find(function (s) { return s.sellerId === sellerId; });
    if (!sellerOrder || sellerOrder.status !== 'ready_for_pickup') return null;

    if (!sellerOrder.pickupTaskId) {
      sellerOrder.pickupTaskId = nextPickupTaskId();
      sellerOrder.pickupCreatedAt = new Date().toISOString();
    }
    write(KEYS.orders, orders);
    emit();
    return order;
  }

  function assignCourier(orderId, sellerId, courierId) {
    var orders = getOrders();
    var order = orders.find(function (o) { return o.id === orderId; });
    if (!order) return null;
    var sellerOrder = order.sellerOrders.find(function (s) { return s.sellerId === sellerId; });
    if (!sellerOrder) return null;
    if (courierId && !getCourier(courierId)) return null;

    sellerOrder.courierId = courierId || null;
    sellerOrder.courierAssignedAt = courierId ? new Date().toISOString() : null;
    write(KEYS.orders, orders);
    emit();
    return order;
  }

  function aggregateStatus(order) {
    if (!order) return { key: 'unknown', label: 'Unknown', tone: 'slate' };
    var active = order.sellerOrders.filter(function (s) { return s.status !== 'rejected'; });
    if (!active.length) {
      return { key: 'rejected', label: 'Rejected', tone: 'red', detail: 'No shops accepted this order.' };
    }

    var delivered = active.filter(function (s) { return s.status === 'delivered'; }).length;
    if (delivered === active.length) {
      return { key: 'delivered', label: 'Delivered', tone: 'green', detail: 'All shops delivered your items.' };
    }

    var statuses = active.map(function (s) { return s.status; });
    var same = statuses.every(function (s) { return s === statuses[0]; });
    if (same) {
      var meta = STATUS_META[statuses[0]];
      return { key: statuses[0], label: meta.label, tone: meta.tone, detail: '' };
    }

    var minIndex = Math.min.apply(null, active.map(function (s) {
      var i = STATUS_FLOW.indexOf(s.status);
      return i < 0 ? 0 : i;
    }));

    return {
      key: 'in_progress',
      label: delivered > 0 ? 'Partially delivered' : 'In progress',
      tone: 'amber',
      step: minIndex,
      detail: delivered + ' of ' + active.length + ' shops delivered'
    };
  }

  function statusIndex(status) {
    return STATUS_FLOW.indexOf(status);
  }

  /* ---------- public API ---------- */

  window.GS = window.GS || {};
  window.GS.Store = {
    KEYS: KEYS,
    STATUS_FLOW: STATUS_FLOW,
    STATUS_META: STATUS_META,
    init: init,
    resetDemo: resetDemo,
    onChange: function (fn) {
      if (typeof fn === 'function') listeners.push(fn);
      return function () {
        listeners = listeners.filter(function (l) { return l !== fn; });
      };
    },
    emit: emit,

    getSellers: getSellers,
    getSeller: getSeller,
    getCouriers: getCouriers,
    getCourier: getCourier,
    getProducts: getProducts,
    saveProducts: saveProducts,
    getProduct: getProduct,
    getCategories: getCategories,
    getOffer: getOffer,
    availableOffers: availableOffers,
    lowestPrice: lowestPrice,
    sellerProducts: sellerProducts,

    getSession: getSession,
    setSession: setSession,

    getCart: getCart,
    addToCart: addToCart,
    setQty: setQty,
    removeLine: removeLine,
    clearCart: clearCart,
    getCartLine: getCartLine,
    getCartDetailed: getCartDetailed,
    getCartGroups: getCartGroups,
    getCartSummary: getCartSummary,

    getOrders: getOrders,
    getOrder: getOrder,
    placeOrder: placeOrder,
    updateSellerOrderStatus: updateSellerOrderStatus,
    advanceCourier: advanceCourier,
    createPickupTask: createPickupTask,
    assignCourier: assignCourier,
    aggregateStatus: aggregateStatus,
    statusIndex: statusIndex
  };

  init(false);
})();
