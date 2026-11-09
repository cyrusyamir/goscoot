# GoScoot — Hyperlocal Delivery MVP

GoScoot is a hyperlocal delivery platform. Local shops list their products; customers
compare sellers, order from the shops they prefer, and GoScoot handles pickup and delivery.

**GoScoot does not own shops or products.** Every item is sold, priced and packed by an
independent local seller. This build is a frontend-only demo — no backend, login or real payments.

## What is built

### Customer store (Phase 1)

| Page | File | What it does |
| --- | --- | --- |
| Home | `index.html` | Hero search, categories, popular shops, best deals, popular and recently added products |
| Local shops | `shops.html` | All sellers with category filters and sorting |
| Shop details | `shop.html?id=seller_001` | One seller's storefront and products |
| Products | `products.html` | Full catalog with search, category filters and sorting |
| Product details | `product.html?id=product_001` | Product info + multi-seller price comparison |
| Cart | `cart.html` | Items grouped by seller, quantity controls, delivery and totals |
| Checkout | `checkout.html` | Contact, address, COD/online simulation, validation |
| Order confirmation | `order-confirmation.html?id=GS10004` | Order ID, seller breakdown, totals |
| Order tracking | `tracking.html?id=GS10002` | Per-seller timelines + demo courier controls |

### Seller dashboard (Phase 2)

| Page | File | What it does |
| --- | --- | --- |
| Overview | `seller/dashboard.html` | KPIs, orders needing action, ready-for-pickup list, stock alerts, recently delivered |
| Orders | `seller/orders.html` | Tabbed queue (new, preparing, ready, in transit, completed, rejected) with accept / reject / prepare / ready actions |
| Products | `seller/products.html` | Search and filter listings; edit price, MRP, stock and visibility; add products; remove this shop's offer |

The seller demo uses a **shop switcher** instead of authentication. Pick any of the six seeded
shops from the header, or open a page with `?seller=seller_005`. Switching shops strips the
query string and stores the choice in `gs_session`.

Customer pages link to the dashboard from the header (**Seller demo**), the mobile nav
(**Seller**) and the footer (**Seller dashboard**).

## Run it

Option 1 — simplest: double-click `index.html`.

Option 2 — local server:

```bash
npx serve .
# or
python -m http.server 8080
```

An internet connection is needed for the Tailwind CDN, Google Fonts and Lucide icons.
Seed data is a JS global (`assets/js/seed.js`) so the demo also works from `file://`.

## Demo flow — customer

1. Search "milk" on the home page.
2. Open **Amul Toned Milk** — three sellers are compared by price and delivery time.
3. Select the cheapest seller, then add another product from a different shop.
4. Open the cart — items stay grouped by seller.
5. Checkout with **Fill demo details** → **Place order** (COD).
6. Open **Track your order**.
7. To see the courier simulation, open `tracking.html?id=GS10002` (a seeded order that is
   already ready for pickup) and press **Simulate: Picked up**, then advance to delivered.

## Demo flow — seller

1. Open **Seller demo** in the header (or `seller/dashboard.html`).
2. Switch to **Daily Needs Store** — it has a new order (`GS10003`) waiting.
3. On the overview, press **Accept order**. The KPI counts and action card update immediately.
4. Open **Orders**, then step the order through **Start preparing → Mark ready for pickup**.
5. Open the customer tracking page for `GS10003` — the seller timeline now shows *Ready for pickup*.
6. Open **Products** to edit a price or stock level, hide a listing, add a new product, or remove
   this shop's offer. Customer pages reflect the change after a refresh.
7. Use **Reset demo data** in the seller footer to restore the seed catalog and orders.

## Data and persistence

- Seed data: `assets/js/seed.js` — 6 sellers, 31 products, 3 demo orders.
- Seed version: `SEED_VERSION = '2'` in `assets/js/store.js` — bump it whenever `seed.js` changes.
- Runtime state: `localStorage`
  - `gs_products` — catalog and seller offers (stock changes when you order)
  - `gs_cart` — cart lines (`productId` + `sellerId` + `qty`)
  - `gs_orders` — parent orders with nested per-seller fulfilments
  - `gs_session` — delivery location, active demo seller (`sellerId`) and role
  - `gs_version` — seed version marker
- Reset: **Reset demo data** in the customer or seller footer, or clear the browser's site data.

## Structure

```
.
├── index.html
├── shops.html
├── shop.html
├── products.html
├── product.html
├── cart.html
├── checkout.html
├── order-confirmation.html
├── tracking.html
├── seller/
│   ├── dashboard.html
│   ├── orders.html
│   └── products.html
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── seed.js          # demo catalog + seeded orders
│       ├── store.js         # shared state, cart, orders, statuses
│       ├── ui.js            # customer header, footer, cards, badges, toasts
│       ├── seller.js        # seller shell, shop switcher, seller helpers
│       └── pages/           # one render script per page
└── goscoot PRD MVP.md
```

## Key behaviour

- A product is one catalog entry with many **offers** (one per seller).
- The cart stores `productId` + `sellerId`, so the same product from two shops is two lines.
- Checkout creates one **parent order** with a separate fulfilment per seller.
- Each seller fulfilment has its own 7-step status:
  `placed → confirmed → preparing → ready_for_pickup → picked_up → out_for_delivery → delivered`
- Sellers can reject only from `placed` or `confirmed`; `rejected` is terminal.
- The parent order shows an aggregate status ("In progress", "Partially delivered", "Delivered").
- Courier steps are simulated on the tracking page until the operations dashboard is built.

## Next phases

1. GoScoot operations dashboard: pickup requests, delivery-partner assignment, delivery updates.
2. Optional: backend, auth, real payments, maps, notifications.
3. Optional: seller analytics, payout summaries and bulk stock updates.

## Excluded from this MVP

Backend/database, authentication, real payment gateway, live inventory sync, GPS/maps,
SMS/WhatsApp notifications, and a real delivery-partner app.
