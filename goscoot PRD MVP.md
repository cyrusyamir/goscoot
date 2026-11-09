GoScoot — MVP Website Product Requirements Document (PRD)
MVP Scope
Frontend Only
No Backend / Database / Authentication

Product: GoScoot — Local Store Delivery Platform
Business Model: Hyperlocal, multi-seller delivery aggregator
Primary Users: Customers, Local Sellers, GoScoot Delivery Operations
1. Product Overview
GoScoot is a hyperlocal delivery platform that connects customers with nearby local shops and merchants.

Customers can browse products available at different local stores, compare prices between sellers, select their preferred seller, and place an order. GoScoot handles the delivery from the seller's shop to the customer's doorstep.

The key distinction: GoScoot is a delivery partner, not a retailer.
- GoScoot does not own shops.
- GoScoot does not manufacture or own products.
- Products are listed on behalf of independent local sellers.
- Sellers are responsible for product availability, pricing, and order preparation.
- GoScoot is responsible for collecting the order from the seller and delivering it to the customer.
Business model reference










Blinkit — Reference

Similar convenience-oriented browsing and ordering experience, but GoScoot operates as a delivery partner for independent local sellers rather than owning or controlling retail inventory.


2. Three-party ecosystem
The entire platform revolves around three independent parties.

1. Local Sellers

Own products, manage pricing and fulfill orders.



2. GoScoot Platform

Connects sellers and customers, coordinates pickup and delivery.



3. Customers

Browse local shops, compare products and place orders.


Responsibilities
Party	Responsibilities
Seller	Product listing, price, stock, order preparation
GoScoot	Platform, order coordination, pickup, delivery
Customer	Browse, select seller, order and receive products

For the MVP, all three parties will be represented through frontend screens and simulated interactions.

3. MVP Objectives
The first version should demonstrate the complete business workflow without implementing a backend.

Primary objectives:
1. Allow customers to discover local shops.
2. Display products from multiple independent sellers.
3. Allow customers to compare prices for identical products.
4. Let customers select their preferred seller.
5. Provide a functional shopping cart.
6. Simulate order placement and confirmation.
7. Demonstrate seller-side order management.
8. Demonstrate GoScoot's delivery coordination process.
9. Show order tracking and delivery status updates.
Success criteria: A user should be able to experience the entire process from browsing a product to successful delivery without needing an account.
4. Website structure and pages
The MVP will have three main interfaces.
A. Customer storefront

Primary


- Homepage
- Shop / Seller listing
- Shop details
- Product listing
- Product details and seller comparison
- Shopping cart
- Checkout
- Order confirmation
- Order tracking


B. Seller dashboard

Demo interface


- Seller overview
- Product management
- Incoming orders
- Order details
- Accept / Reject order
- Mark order as ready for pickup


C. GoScoot operations dashboard

Demo interface


- Operations overview
- All customer orders
- Seller order status
- Pickup requests
- Delivery assignments
- Delivery status updates
- Completed deliveries


5. Detailed functional requirements
A. Customer storefront






















13














5.1 Homepage

The homepage should contain:
- GoScoot logo and navigation.
- Location selector (e.g. Lucknow).
- Search bar.
- Category navigation.
- Promotional banner.
- Popular local shops.
- Popular products.
- Best deals from nearby sellers.
- Recently added products.
Suggested categories:
Category	Example products
Grocery	Rice, flour, pulses
Fruits & Vegetables	Apples, potatoes, tomatoes
Dairy	Milk, butter, paneer
Snacks	Biscuits, chips, namkeen
Personal Care	Shampoo, soap
Household	Detergents, cleaners

5.2 Shop / Seller listing

Customers should be able to discover independent local stores.

Each seller card should display:
- Shop name and logo.
- Shop category.
- Shop location.
- Estimated delivery time.
- Minimum order amount (if applicable).
- Rating (sample data).
- Browse shop button.
Example sellers:
- Sharma General Store
- Fresh Mart
- Gupta Dairy
- City Supermarket
- Daily Needs Store
5.3 Product browsing

Display products from all participating sellers.

Product cards should contain:
- Product image.
- Product name.
- Brand.
- Quantity / unit.
- Starting price.
- Number of sellers offering the product.
- Add to cart / View sellers.
B. Multi-seller product comparison
Core business differentiator
A single product can be available from multiple independent sellers at different prices.

For example:










Amul Toned Milk

1 Litre · Dairy
₹62
Starting price



Available from local sellers
Sharma General Store

20–30 min delivery

₹62
Available

Select seller
Gupta Dairy

15–25 min delivery

₹64
Available

Select seller
Fresh Mart

30–40 min delivery

₹60
Lowest

Select seller
When a customer opens a product:
1. Display product information.
2. Fetch (in this MVP, read from sample data) all sellers offering that product.
3. Show each seller's price.
4. Display delivery estimate.
5. Allow customer to choose a seller.
6. Add the selected seller's product to cart.
Important business rule: The cart must preserve the seller associated with every product. Two identical products from different shops are separate cart entries.
C. Shopping cart
The cart should display:
- Selected products.
- Seller/shop associated with each item.
- Quantity controls.
- Individual product price.
- Subtotal.
- Delivery fee.
- Platform/service fee (optional).
- Grand total.
For the MVP, support multiple sellers in one customer checkout.

The system should split a multi-seller checkout into separate seller-specific fulfillment orders under one customer-facing parent order.

Example:
Your shopping cart
Sharma General Store

Seller 1

- Rice — ₹60
- Milk — ₹62
  
  Gupta Dairy
  
  Seller 2
- Paneer — ₹100
  
  Subtotal
  
  ₹222
  
  Delivery
  
  ₹30
  
  
  Total
  ₹252
  
  One checkout · Two seller fulfillments

For demonstration purposes, delivery can be shown as a combined fee, but the underlying order representation should preserve separate pickup and fulfillment details.
D. Checkout
Checkout should include:
- Customer name.
- Mobile number.
- Delivery address.
- Landmark.
- Delivery instructions.
- Payment method selection.
Payment methods:
- Cash on Delivery (COD).
- Online payment (simulation only).
The Place Order button should create a simulated order in frontend state.

No real payment gateway or OTP should be implemented.
E. Order confirmation and tracking








dribbble.com


Once an order is placed, show:
- Unique demo order ID.
- Customer details.
- Seller-wise order breakdown.
- Total amount.
- Payment method.
- Current delivery status.
Order lifecycle:
1. Order Placed
   
   Customer completes checkout.
2. Seller Confirmation
   
   Seller accepts the order and confirms availability.
3. Preparing Order
   
   Seller packs the products.
4. Ready for Pickup
   
   Seller notifies GoScoot.
5. Pickup Assigned
   
   GoScoot assigns a delivery partner.
6. Picked Up
   
   Delivery partner collects the order.
7. Out for Delivery
   
   Order is on its way.
8. Delivered
   
   Customer receives the order.

For multiple sellers, each seller fulfillment should have its own status. The parent order should display an aggregated status, so one seller's delay does not incorrectly mark every seller's items as ready.

6. Seller dashboard






















9











The seller dashboard is a demonstration of how local merchants interact with GoScoot.
Dashboard overview
Show:
- Total products.
- Active orders.
- Pending orders.
- Ready for pickup.
- Completed orders.
Product management
The interface should allow a seller to:
- View products.
- Add a product.
- Edit product details.
- Update pricing.
- Change stock availability.
- Enable / disable a product.
Order management
Each incoming order should show:
- Order ID.
- Customer name.
- Products ordered.
- Quantity.
- Total seller order value.
- Order timestamp.
- Current status.
Seller actions:
Action	Result
Accept	Order accepted
Reject	Order rejected
Start preparing	Preparing
Mark ready	Ready for pickup

All changes should be reflected in the customer order tracking and GoScoot operations dashboard.

7. GoScoot delivery operations dashboard








geofleet.ai


This interface represents the platform's main business responsibility.
Dashboard overview
- Total customer orders.
- Orders awaiting seller confirmation.
- Orders being prepared.
- Pickup requests.
- Active deliveries.
- Completed deliveries.
Delivery management
The operations team should be able to:
1. View confirmed seller orders.
2. See which sellers have prepared orders.
3. Create pickup tasks.
4. Assign a demo delivery partner.
5. Update pickup status.
6. Update delivery status.
7. Complete the delivery.
Demo delivery partners
- Rahul — Available
- Amit — Available
- Sameer — On Delivery
Delivery assignment should be simulated using dropdowns or buttons.

8. Complete system workflow
This is the most important part of the MVP.
#chatgpt-mermaid-_r_ek_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_ek_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_ek_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_ek_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_ek_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_ek_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_ek_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_ek_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_ek_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_ek_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_ek_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_ek_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_ek_ p{margin:0;}#chatgpt-mermaid-_r_ek_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_ek_ .label text,#chatgpt-mermaid-_r_ek_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ .node rect,#chatgpt-mermaid-_r_ek_ .node circle,#chatgpt-mermaid-_r_ek_ .node ellipse,#chatgpt-mermaid-_r_ek_ .node polygon,#chatgpt-mermaid-_r_ek_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .rough-node .label text,#chatgpt-mermaid-_r_ek_ .node .label text,#chatgpt-mermaid-_r_ek_ .image-shape .label,#chatgpt-mermaid-_r_ek_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_ek_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .rough-node .label,#chatgpt-mermaid-_r_ek_ .node .label,#chatgpt-mermaid-_r_ek_ .image-shape .label,#chatgpt-mermaid-_r_ek_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_ek_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_ek_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_ek_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-_r_ek_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-_r_ek_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_ek_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-_r_ek_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_ek_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-_r_ek_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_ek_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_ek_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_ek_ .icon-shape,#chatgpt-mermaid-_r_ek_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_ek_ .icon-shape p,#chatgpt-mermaid-_r_ek_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-_r_ek_ .icon-shape .label rect,#chatgpt-mermaid-_r_ek_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_ek_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_ek_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_ek_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_ek_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_ek_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_ek_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_ek_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_ek_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_ek_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_ek_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_ek_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_ek_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_ek_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_ek_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_ek_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_ek_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_ek_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_ek_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_ek_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_ek_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_ek_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_ek_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_ek_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_ek_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .node rect,#chatgpt-mermaid-_r_ek_ .node circle,#chatgpt-mermaid-_r_ek_ .node ellipse,#chatgpt-mermaid-_r_ek_ .node polygon,#chatgpt-mermaid-_r_ek_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_ek_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_ek_ .mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-_r_ek_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_ek_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_ek_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Customer visits GoScootBrowse local shops andproductsSelect productCompare multiple sellersSelect preferred sellerAdd to cartMore products?CheckoutPlace orderCreate parent orderSplit into seller fulfillmentsSeller receives orderSeller accepts?Rejected / CustomerinterventionSeller prepares productsReady for pickupGoScoot assigns deliveryPickup from sellerOut for deliveryDelivered to customerComplete orderYesNoNoYes





For multiple sellers, repeat the seller fulfillment and pickup process for each participating shop. The MVP can simulate either independent pickups or one consolidated delivery run.
9. Frontend technology and architecture
Since this is a demonstration MVP, there is no need to implement server-side infrastructure.

Recommended stack:
Technology	Purpose
HTML5	Structure
CSS3	Styling
JavaScript ES6+	Interactions and state
Tailwind CSS	UI styling
EJS or static HTML	Page templating (optional)
LocalStorage	Persist demo data
Lucide Icons	Interface icons

Alternatively, use vanilla HTML, CSS and JavaScript if you want the simplest implementation without a framework.
Frontend architecture
GoScoot Frontend Application

Customer


Seller


Operations




Shared JavaScript State Manager

Cart · Products · Sellers · Orders · Delivery status


LocalStorage / Sample JSON Data

Simulated persistence without a database


Suggested project structure
goscoot/
│
├── index.html
├── shops.html
├── shop-details.html
├── products.html
├── product-details.html
├── cart.html
├── checkout.html
├── order-confirmation.html
├── tracking.html
│
├── seller/
│   ├── dashboard.html
│   ├── products.html
│   └── orders.html
│
├── operations/
│   ├── dashboard.html
│   ├── orders.html
│   └── deliveries.html
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
└── data/
    ├── sellers.json
    ├── products.json
    ├── categories.json
    └── orders.json


10. Sample data structure
The data model should already be designed with future backend development in mind.

Sellers
{
  "id": "seller_001",
  "name": "Sharma General Store",
  "category": "Grocery",
  "location": "Aliganj, Lucknow",
  "deliveryAvailable": true
}


Products
{
  "id": "product_001",
  "name": "Amul Toned Milk",
  "brand": "Amul",
  "unit": "1 Litre",
  "category": "Dairy",
  "offers": [
    {
      "sellerId": "seller_001",
      "price": 62,
      "available": true
    },
    {
      "sellerId": "seller_002",
      "price": 64,
      "available": true
    }
  ]
}


Orders
{
  "id": "GS10001",
  "customer": {
    "name": "Demo Customer",
    "phone": "9999999999"
  },
  "items": [
    {
      "productId": "product_001",
      "sellerId": "seller_001",
      "quantity": 2,
      "price": 62
    }
  ],
  "status": "placed",
  "paymentMethod": "COD",
  "deliveryStatus": "pending"
}


These are illustrative frontend structures, not a finalized production database schema.

11. MVP scope: Included vs excluded
Feature	MVP
Homepage and navigation	Included
Shop listings	Included
Product catalog	Included
Multi-seller comparison	Included
Shopping cart	Included
Multi-seller checkout	Included
Seller dashboard	Included
Operations dashboard	Included
Order tracking	Included
Live inventory synchronization	Excluded
Real user authentication	Excluded
Real payment gateway	Excluded
Maps and GPS tracking	Excluded
Real delivery partner app	Excluded
SMS / WhatsApp notifications	Excluded
Backend and database	Excluded

12. UI/UX and branding direction






















10











Recommended brand direction:
Element	Recommendation
Brand	GoScoot
Primary color	Deep green #176B45
Secondary color	Fresh lime #C6E86B
Background	#F8FAF6
Text	#202820
Typography	Inter / Plus Jakarta Sans
Style	Modern, clean, friendly
Design approach	Mobile-first

The interface should feel like a modern quick-commerce application while maintaining a distinct identity as a local-shop delivery platform.

13. Implementation phases
Phase	Deliverables	Priority
1	Design system, navigation, homepage	High
2	Shop listing and product browsing	High
3	Multi-seller comparison and cart	Critical
4	Checkout and order creation	Critical
5	Seller dashboard and order handling	High
6	GoScoot operations dashboard	High
7	Delivery tracking simulation	High
8	Responsive testing and polish	High

14. MVP acceptance criteria
The project is ready for demonstration when:
- [ ] Customers can browse multiple local shops.
- [ ] Customers can browse products across sellers.
- [ ] Identical products can have different sellers and prices.
- [ ] Customers can select their preferred seller.
- [ ] Cart correctly remembers seller-product relationships.
- [ ] Customers can order products from multiple sellers.
- [ ] Checkout generates a parent order and separate seller fulfillments.
- [ ] Sellers can accept or reject their assigned orders.
- [ ] Sellers can mark products ready for pickup.
- [ ] GoScoot can assign delivery partners.
- [ ] Delivery statuses update across dashboards.
- [ ] Customer can see order progress.
- [ ] The order can reach a completed delivery state.
- [ ] The entire demo works without login or a backend.

15. Important business decisions for the next version
These are not blockers for the frontend MVP, but should be considered before developing the real platform.
1. Multi-seller delivery: Will GoScoot collect multiple orders in a single delivery route, or charge separately for each seller pickup?
2. Seller onboarding: Will sellers add products themselves, or will GoScoot initially manage their catalogs?
3. Delivery pricing: Fixed fee, distance-based pricing, or seller-specific delivery charges?
4. Order rejection: If one seller rejects an order containing multiple sellers, should the remaining order proceed?
5. Inventory: Who is responsible for maintaining accurate stock availability?
6. Payments: Will customers pay GoScoot, sellers directly, or use COD?
7. Revenue model: Delivery charges, seller commissions, subscription fees, or a combination?
These decisions will influence the eventual backend architecture and operational workflow.

Final MVP recommendation
I recommend building GoScoot as one frontend application with three interconnected interfaces, rather than developing three separate websites.

The customer storefront should be the primary experience, while the seller and operations dashboards should be accessible through demo navigation.
Recommended demo navigation
Customer Store

Default landing page


Seller Dashboard


GoScoot Operations


A demo role switcher in the navigation allows switching between all three interfaces without authentication.

Most important technical recommendation: Build a shared frontend state system. When a seller accepts an order, the operations dashboard should immediately reflect that change, and the customer's tracking screen should update too. This makes the MVP feel like a real interconnected platform rather than three disconnected UI mockups.

The next logical step is to convert this PRD into a detailed page-by-page wireframe and development task breakdown, then implement the working frontend prototype.