/* GoScoot demo seed data.
 * Loaded before store.js. Kept as a JS global so the demo also works when
 * opened directly from disk (fetching local JSON is blocked on file://).
 */
window.GS_SEED = {
  version: 3,

  categories: [
    { id: 'grocery', name: 'Grocery', emoji: '🛒' },
    { id: 'fruits', name: 'Fruits & Vegetables', emoji: '🥬' },
    { id: 'dairy', name: 'Dairy', emoji: '🥛' },
    { id: 'snacks', name: 'Snacks', emoji: '🍪' },
    { id: 'personal-care', name: 'Personal Care', emoji: '🧴' },
    { id: 'household', name: 'Household', emoji: '🧹' }
  ],

  couriers: [
    { id: 'courier_001', name: 'Rahul', phone: '9000011111', vehicle: 'Bike · UP32 AB 1024', status: 'available' },
    { id: 'courier_002', name: 'Amit', phone: '9000022222', vehicle: 'Scooter · UP32 CD 2048', status: 'available' },
    { id: 'courier_003', name: 'Sameer', phone: '9000033333', vehicle: 'Bike · UP32 EF 4096', status: 'on_delivery' }
  ],

  sellers: [
    {
      id: 'seller_001',
      name: 'Sharma General Store',
      emoji: '🏪',
      category: 'Grocery',
      location: 'Aliganj, Lucknow',
      etaMin: 20,
      etaMax: 30,
      minOrder: 99,
      rating: 4.5,
      deliveryFee: 20,
      tags: ['Popular', 'Fast delivery']
    },
    {
      id: 'seller_002',
      name: 'Fresh Mart',
      emoji: '🥬',
      category: 'Fruits & Vegetables',
      location: 'Gomti Nagar, Lucknow',
      etaMin: 30,
      etaMax: 40,
      minOrder: 149,
      rating: 4.3,
      deliveryFee: 25,
      tags: ['Fresh produce']
    },
    {
      id: 'seller_003',
      name: 'Gupta Dairy',
      emoji: '🥛',
      category: 'Dairy',
      location: 'Hazratganj, Lucknow',
      etaMin: 15,
      etaMax: 25,
      minOrder: 49,
      rating: 4.7,
      deliveryFee: 15,
      tags: ['Dairy specialist', 'Fast delivery']
    },
    {
      id: 'seller_004',
      name: 'City Supermarket',
      emoji: '🛒',
      category: 'Household',
      location: 'Indira Nagar, Lucknow',
      etaMin: 35,
      etaMax: 45,
      minOrder: 199,
      rating: 4.2,
      deliveryFee: 30,
      tags: ['Big savings']
    },
    {
      id: 'seller_005',
      name: 'Daily Needs Store',
      emoji: '🏬',
      category: 'Snacks',
      location: 'Vikas Nagar, Lucknow',
      etaMin: 20,
      etaMax: 30,
      minOrder: 79,
      rating: 4.4,
      deliveryFee: 20,
      tags: ['Daily essentials']
    },
    {
      id: 'seller_006',
      name: 'Green Basket',
      emoji: '🍎',
      category: 'Fruits & Vegetables',
      location: 'Jankipuram, Lucknow',
      etaMin: 25,
      etaMax: 35,
      minOrder: 99,
      rating: 4.6,
      deliveryFee: 25,
      tags: ['Farm fresh', 'Popular']
    }
  ],

  products: [
    {
      id: 'product_001',
      name: 'Amul Toned Milk',
      brand: 'Amul',
      unit: '1 Litre',
      category: 'Dairy',
      emoji: '🥛',
      description: 'Fresh pasteurised toned milk, perfect for everyday tea, cereal and cooking.',
      addedAt: '2026-11-02',
      offers: [
        { sellerId: 'seller_001', price: 62, mrp: 66, available: true, stock: 12 },
        { sellerId: 'seller_002', price: 60, mrp: 66, available: true, stock: 8 },
        { sellerId: 'seller_003', price: 64, mrp: 66, available: true, stock: 20 }
      ]
    },
    {
      id: 'product_002',
      name: 'Amul Butter',
      brand: 'Amul',
      unit: '500 g',
      category: 'Dairy',
      emoji: '🧈',
      description: 'Creamy salted butter made from fresh cream. A breakfast favourite.',
      addedAt: '2026-10-21',
      offers: [
        { sellerId: 'seller_001', price: 290, mrp: 295, available: true, stock: 4 },
        { sellerId: 'seller_003', price: 285, mrp: 295, available: true, stock: 6 },
        { sellerId: 'seller_004', price: 280, mrp: 295, available: true, stock: 3 }
      ]
    },
    {
      id: 'product_003',
      name: 'Mother Dairy Paneer',
      brand: 'Mother Dairy',
      unit: '200 g',
      category: 'Dairy',
      emoji: '🧀',
      description: 'Soft, fresh paneer made from pure milk. Ideal for curries and grills.',
      addedAt: '2026-10-28',
      offers: [
        { sellerId: 'seller_002', price: 105, mrp: 110, available: true, stock: 4 },
        { sellerId: 'seller_003', price: 100, mrp: 110, available: true, stock: 5 }
      ]
    },
    {
      id: 'product_004',
      name: 'Mother Dairy Curd',
      brand: 'Mother Dairy',
      unit: '400 g',
      category: 'Dairy',
      emoji: '🍶',
      description: 'Thick and creamy set curd with a mild, fresh taste.',
      addedAt: '2026-10-24',
      offers: [
        { sellerId: 'seller_001', price: 48, mrp: 50, available: true, stock: 6 },
        { sellerId: 'seller_003', price: 45, mrp: 50, available: true, stock: 10 }
      ]
    },
    {
      id: 'product_005',
      name: 'Farm Eggs',
      brand: 'Local Farm',
      unit: '6 pieces',
      category: 'Dairy',
      emoji: '🥚',
      description: 'Farm-fresh eggs, carefully packed to reach you without cracks.',
      addedAt: '2026-11-05',
      offers: [
        { sellerId: 'seller_001', price: 48, mrp: 54, available: true, stock: 15 },
        { sellerId: 'seller_002', price: 50, mrp: 54, available: true, stock: 12 },
        { sellerId: 'seller_005', price: 46, mrp: 54, available: true, stock: 10 }
      ]
    },
    {
      id: 'product_006',
      name: 'India Gate Basmati Rice',
      brand: 'India Gate',
      unit: '1 kg',
      category: 'Grocery',
      emoji: '🍚',
      description: 'Long-grain aged basmati rice with a rich aroma and fluffy texture.',
      addedAt: '2026-10-18',
      offers: [
        { sellerId: 'seller_001', price: 60, mrp: 70, available: true, stock: 20 },
        { sellerId: 'seller_002', price: 62, mrp: 70, available: true, stock: 9 },
        { sellerId: 'seller_004', price: 65, mrp: 70, available: true, stock: 15 }
      ]
    },
    {
      id: 'product_007',
      name: 'Aashirvaad Atta',
      brand: 'Aashirvaad',
      unit: '5 kg',
      category: 'Grocery',
      emoji: '🌾',
      description: 'Whole wheat atta milled from select grains for soft, fluffy rotis.',
      addedAt: '2026-10-16',
      offers: [
        { sellerId: 'seller_001', price: 285, mrp: 310, available: true, stock: 8 },
        { sellerId: 'seller_004', price: 279, mrp: 310, available: true, stock: 6 }
      ]
    },
    {
      id: 'product_008',
      name: 'Toor Dal',
      brand: 'Local Select',
      unit: '1 kg',
      category: 'Grocery',
      emoji: '🫘',
      description: 'Clean, unpolished toor dal that cooks quickly and tastes homely.',
      addedAt: '2026-10-19',
      offers: [
        { sellerId: 'seller_001', price: 145, mrp: 160, available: true, stock: 10 },
        { sellerId: 'seller_002', price: 150, mrp: 160, available: true, stock: 7 }
      ]
    },
    {
      id: 'product_009',
      name: 'Fortune Sunflower Oil',
      brand: 'Fortune',
      unit: '1 Litre',
      category: 'Grocery',
      emoji: '🛢️',
      description: 'Light and refined sunflower oil for everyday Indian cooking.',
      addedAt: '2026-10-22',
      offers: [
        { sellerId: 'seller_001', price: 135, mrp: 150, available: true, stock: 9 },
        { sellerId: 'seller_004', price: 130, mrp: 150, available: true, stock: 5 }
      ]
    },
    {
      id: 'product_010',
      name: 'Sugar',
      brand: 'Madhur',
      unit: '1 kg',
      category: 'Grocery',
      emoji: '🍬',
      description: 'Fine, sulphur-free white sugar for tea, desserts and baking.',
      addedAt: '2026-10-14',
      offers: [
        { sellerId: 'seller_001', price: 46, mrp: 50, available: true, stock: 25 },
        { sellerId: 'seller_002', price: 48, mrp: 50, available: true, stock: 18 }
      ]
    },
    {
      id: 'product_011',
      name: 'Tata Salt',
      brand: 'Tata',
      unit: '1 kg',
      category: 'Grocery',
      emoji: '🧂',
      description: 'Iodised salt with the familiar taste every kitchen trusts.',
      addedAt: '2026-10-12',
      offers: [
        { sellerId: 'seller_001', price: 28, mrp: 30, available: true, stock: 30 },
        { sellerId: 'seller_004', price: 27, mrp: 30, available: true, stock: 22 },
        { sellerId: 'seller_005', price: 29, mrp: 30, available: true, stock: 16 }
      ]
    },
    {
      id: 'product_012',
      name: 'Maggi 2-Minute Noodles',
      brand: 'Nestle',
      unit: '4-pack',
      category: 'Snacks',
      emoji: '🍜',
      description: 'The classic masala noodles, ready in two minutes.',
      addedAt: '2026-11-06',
      offers: [
        { sellerId: 'seller_001', price: 56, mrp: 60, available: true, stock: 14 },
        { sellerId: 'seller_004', price: 58, mrp: 60, available: true, stock: 9 },
        { sellerId: 'seller_005', price: 54, mrp: 60, available: true, stock: 11 }
      ]
    },
    {
      id: 'product_013',
      name: 'Bananas',
      brand: 'Farm Fresh',
      unit: '1 dozen',
      category: 'Fruits & Vegetables',
      emoji: '🍌',
      description: 'Naturally ripened bananas, sweet and rich in potassium.',
      addedAt: '2026-11-07',
      offers: [
        { sellerId: 'seller_002', price: 60, mrp: 70, available: true, stock: 20 },
        { sellerId: 'seller_006', price: 55, mrp: 70, available: true, stock: 25 }
      ]
    },
    {
      id: 'product_014',
      name: 'Tomatoes',
      brand: 'Farm Fresh',
      unit: '500 g',
      category: 'Fruits & Vegetables',
      emoji: '🍅',
      description: 'Firm, ripe tomatoes picked from nearby farms this morning.',
      addedAt: '2026-11-08',
      offers: [
        { sellerId: 'seller_002', price: 24, mrp: 30, available: true, stock: 30 },
        { sellerId: 'seller_006', price: 20, mrp: 30, available: true, stock: 28 }
      ]
    },
    {
      id: 'product_015',
      name: 'Potatoes',
      brand: 'Farm Fresh',
      unit: '1 kg',
      category: 'Fruits & Vegetables',
      emoji: '🥔',
      description: 'Everyday cooking potatoes, sorted and cleaned.',
      addedAt: '2026-11-01',
      offers: [
        { sellerId: 'seller_002', price: 32, mrp: 40, available: true, stock: 40 },
        { sellerId: 'seller_006', price: 28, mrp: 40, available: true, stock: 35 }
      ]
    },
    {
      id: 'product_016',
      name: 'Shimla Apples',
      brand: 'Farm Fresh',
      unit: '1 kg',
      category: 'Fruits & Vegetables',
      emoji: '🍎',
      description: 'Crisp, juicy apples with a naturally sweet finish.',
      addedAt: '2026-10-30',
      offers: [
        { sellerId: 'seller_002', price: 140, mrp: 160, available: true, stock: 12 },
        { sellerId: 'seller_006', price: 130, mrp: 160, available: true, stock: 15 }
      ]
    },
    {
      id: 'product_017',
      name: 'Onions',
      brand: 'Farm Fresh',
      unit: '1 kg',
      category: 'Fruits & Vegetables',
      emoji: '🧅',
      description: 'Fresh pink onions, a must-have for every Indian kitchen.',
      addedAt: '2026-10-26',
      offers: [
        { sellerId: 'seller_002', price: 30, mrp: 38, available: true, stock: 33 },
        { sellerId: 'seller_006', price: 26, mrp: 38, available: true, stock: 30 }
      ]
    },
    {
      id: 'product_018',
      name: 'Spinach',
      brand: 'Farm Fresh',
      unit: '250 g',
      category: 'Fruits & Vegetables',
      emoji: '🥬',
      description: 'Tender green spinach leaves, washed and bunched.',
      addedAt: '2026-11-04',
      offers: [
        { sellerId: 'seller_002', price: 18, mrp: 22, available: true, stock: 18 },
        { sellerId: 'seller_006', price: 15, mrp: 22, available: true, stock: 20 }
      ]
    },
    {
      id: 'product_019',
      name: "Lay's Classic Salted",
      brand: "Lay's",
      unit: '52 g',
      category: 'Snacks',
      emoji: '🍟',
      description: 'Thin, crispy potato chips with just the right amount of salt.',
      addedAt: '2026-10-27',
      offers: [
        { sellerId: 'seller_001', price: 22, mrp: 25, available: true, stock: 25 },
        { sellerId: 'seller_005', price: 20, mrp: 25, available: true, stock: 40 }
      ]
    },
    {
      id: 'product_020',
      name: 'Parle-G Biscuits',
      brand: 'Parle',
      unit: '800 g',
      category: 'Snacks',
      emoji: '🍪',
      description: 'The original glucose biscuit, great with chai.',
      addedAt: '2026-10-10',
      offers: [
        { sellerId: 'seller_001', price: 78, mrp: 85, available: true, stock: 12 },
        { sellerId: 'seller_004', price: 72, mrp: 85, available: true, stock: 10 },
        { sellerId: 'seller_005', price: 75, mrp: 85, available: true, stock: 14 }
      ]
    },
    {
      id: 'product_021',
      name: 'Haldiram Bhujia',
      brand: 'Haldiram',
      unit: '400 g',
      category: 'Snacks',
      emoji: '🥨',
      description: 'Crispy, spicy bhujia for evening snacks and chaat.',
      addedAt: '2026-10-23',
      offers: [
        { sellerId: 'seller_001', price: 98, mrp: 110, available: true, stock: 7 },
        { sellerId: 'seller_005', price: 95, mrp: 110, available: true, stock: 9 }
      ]
    },
    {
      id: 'product_022',
      name: 'Coca-Cola',
      brand: 'Coca-Cola',
      unit: '750 ml',
      category: 'Snacks',
      emoji: '🥤',
      description: 'Chilled fizzy cola to go with snacks and meals.',
      addedAt: '2026-11-03',
      offers: [
        { sellerId: 'seller_001', price: 42, mrp: 45, available: true, stock: 18 },
        { sellerId: 'seller_004', price: 38, mrp: 45, available: true, stock: 16 },
        { sellerId: 'seller_005', price: 40, mrp: 45, available: true, stock: 22 }
      ]
    },
    {
      id: 'product_023',
      name: 'Cadbury Dairy Milk',
      brand: 'Cadbury',
      unit: '50 g',
      category: 'Snacks',
      emoji: '🍫',
      description: 'Smooth milk chocolate, a small everyday treat.',
      addedAt: '2026-11-08',
      offers: [
        { sellerId: 'seller_001', price: 44, mrp: 50, available: true, stock: 20 },
        { sellerId: 'seller_005', price: 45, mrp: 50, available: true, stock: 26 }
      ]
    },
    {
      id: 'product_024',
      name: 'Dove Shampoo',
      brand: 'Dove',
      unit: '340 ml',
      category: 'Personal Care',
      emoji: '🧴',
      description: 'Moisturising shampoo for soft, manageable hair.',
      addedAt: '2026-10-29',
      offers: [
        { sellerId: 'seller_001', price: 305, mrp: 349, available: true, stock: 5 },
        { sellerId: 'seller_004', price: 299, mrp: 349, available: true, stock: 7 }
      ]
    },
    {
      id: 'product_025',
      name: 'Colgate Strong Teeth',
      brand: 'Colgate',
      unit: '200 g',
      category: 'Personal Care',
      emoji: '🪥',
      description: 'Fluoride toothpaste for stronger teeth and fresher breath.',
      addedAt: '2026-10-20',
      offers: [
        { sellerId: 'seller_001', price: 102, mrp: 110, available: true, stock: 11 },
        { sellerId: 'seller_004', price: 99, mrp: 110, available: true, stock: 13 },
        { sellerId: 'seller_005', price: 105, mrp: 110, available: true, stock: 9 }
      ]
    },
    {
      id: 'product_026',
      name: 'Dettol Soap',
      brand: 'Dettol',
      unit: '4-pack',
      category: 'Personal Care',
      emoji: '🧼',
      description: 'Antibacterial bath soap with trusted Dettol protection.',
      addedAt: '2026-10-25',
      offers: [
        { sellerId: 'seller_004', price: 180, mrp: 200, available: true, stock: 10 },
        { sellerId: 'seller_005', price: 175, mrp: 200, available: true, stock: 8 }
      ]
    },
    {
      id: 'product_027',
      name: 'Gillette Presto Razor',
      brand: 'Gillette',
      unit: '1 piece',
      category: 'Personal Care',
      emoji: '🪒',
      description: 'Easy, comfortable shave with a lubricated strip.',
      addedAt: '2026-10-17',
      offers: [
        { sellerId: 'seller_004', price: 199, mrp: 225, available: true, stock: 6 },
        { sellerId: 'seller_005', price: 210, mrp: 225, available: true, stock: 5 }
      ]
    },
    {
      id: 'product_028',
      name: 'Surf Excel Easy Wash',
      brand: 'Surf Excel',
      unit: '1 kg',
      category: 'Household',
      emoji: '🧺',
      description: 'Tough stain removal that is gentle on everyday fabrics.',
      addedAt: '2026-10-15',
      offers: [
        { sellerId: 'seller_001', price: 220, mrp: 240, available: true, stock: 7 },
        { sellerId: 'seller_004', price: 215, mrp: 240, available: true, stock: 9 }
      ]
    },
    {
      id: 'product_029',
      name: 'Vim Dishwash Liquid',
      brand: 'Vim',
      unit: '500 ml',
      category: 'Household',
      emoji: '🍽️',
      description: 'Lemon-powered dishwashing liquid that cuts through grease.',
      addedAt: '2026-11-01',
      offers: [
        { sellerId: 'seller_004', price: 105, mrp: 120, available: true, stock: 12 },
        { sellerId: 'seller_005', price: 110, mrp: 120, available: true, stock: 9 }
      ]
    },
    {
      id: 'product_030',
      name: 'Harpic Toilet Cleaner',
      brand: 'Harpic',
      unit: '500 ml',
      category: 'Household',
      emoji: '🚽',
      description: 'Thick toilet cleaner that removes stains and kills germs.',
      addedAt: '2026-10-13',
      offers: [
        { sellerId: 'seller_001', price: 102, mrp: 115, available: true, stock: 6 },
        { sellerId: 'seller_004', price: 98, mrp: 115, available: true, stock: 8 }
      ]
    },
    {
      id: 'product_031',
      name: 'Good Knight Refill',
      brand: 'Good Knight',
      unit: '1 refill',
      category: 'Household',
      emoji: '🦟',
      description: 'Long-lasting mosquito repellent refill for peaceful nights.',
      addedAt: '2026-11-06',
      offers: [
        { sellerId: 'seller_004', price: 78, mrp: 90, available: true, stock: 11 },
        { sellerId: 'seller_005', price: 80, mrp: 90, available: true, stock: 9 }
      ]
    }
  ],

  orders: [
    {
      id: 'GS10001',
      createdAt: '2026-11-08T11:20:00.000Z',
      customer: {
        name: 'Aarav Mehta',
        phone: '9876543210',
        address: '12/4, Aliganj Main Road, near Nari Shiksha Kendra',
        landmark: 'Opposite Bank of Baroda',
        instructions: 'Please ring the bell twice.'
      },
      paymentMethod: 'COD',
      sellerOrders: [
        {
          sellerId: 'seller_003',
          items: [
            { productId: 'product_001', name: 'Amul Toned Milk', unit: '1 Litre', emoji: '🥛', price: 64, qty: 2 },
            { productId: 'product_003', name: 'Mother Dairy Paneer', unit: '200 g', emoji: '🧀', price: 100, qty: 1 }
          ],
          subtotal: 228,
          deliveryFee: 15,
          status: 'delivered',
          pickupTaskId: 'PKP-1001',
          courierId: 'courier_003',
          history: [
            { status: 'placed', at: '2026-11-08T11:20:00.000Z' },
            { status: 'confirmed', at: '2026-11-08T11:22:00.000Z' },
            { status: 'preparing', at: '2026-11-08T11:25:00.000Z' },
            { status: 'ready_for_pickup', at: '2026-11-08T11:32:00.000Z' },
            { status: 'picked_up', at: '2026-11-08T11:40:00.000Z' },
            { status: 'out_for_delivery', at: '2026-11-08T11:45:00.000Z' },
            { status: 'delivered', at: '2026-11-08T11:58:00.000Z' }
          ]
        },
        {
          sellerId: 'seller_001',
          items: [
            { productId: 'product_006', name: 'India Gate Basmati Rice', unit: '1 kg', emoji: '🍚', price: 60, qty: 1 },
            { productId: 'product_005', name: 'Farm Eggs', unit: '6 pieces', emoji: '🥚', price: 48, qty: 1 }
          ],
          subtotal: 108,
          deliveryFee: 20,
          status: 'delivered',
          pickupTaskId: 'PKP-1002',
          courierId: 'courier_003',
          history: [
            { status: 'placed', at: '2026-11-08T11:20:00.000Z' },
            { status: 'confirmed', at: '2026-11-08T11:24:00.000Z' },
            { status: 'preparing', at: '2026-11-08T11:28:00.000Z' },
            { status: 'ready_for_pickup', at: '2026-11-08T11:36:00.000Z' },
            { status: 'picked_up', at: '2026-11-08T11:42:00.000Z' },
            { status: 'out_for_delivery', at: '2026-11-08T11:47:00.000Z' },
            { status: 'delivered', at: '2026-11-08T12:05:00.000Z' }
          ]
        }
      ],
      totals: { subtotal: 336, delivery: 35, serviceFee: 10, grandTotal: 381 }
    },
    {
      id: 'GS10002',
      createdAt: '2026-11-09T09:05:00.000Z',
      customer: {
        name: 'Neha Singh',
        phone: '9911223344',
        address: 'B-42, Gomti Nagar Extension, Sector 5',
        landmark: 'Near Lulu Mall',
        instructions: 'Call on arrival.'
      },
      paymentMethod: 'Online',
      sellerOrders: [
        {
          sellerId: 'seller_002',
          items: [
            { productId: 'product_013', name: 'Bananas', unit: '1 dozen', emoji: '🍌', price: 60, qty: 1 },
            { productId: 'product_014', name: 'Tomatoes', unit: '500 g', emoji: '🍅', price: 24, qty: 2 }
          ],
          subtotal: 108,
          deliveryFee: 25,
          status: 'ready_for_pickup',
          history: [
            { status: 'placed', at: '2026-11-09T09:05:00.000Z' },
            { status: 'confirmed', at: '2026-11-09T09:07:00.000Z' },
            { status: 'preparing', at: '2026-11-09T09:10:00.000Z' },
            { status: 'ready_for_pickup', at: '2026-11-09T09:18:00.000Z' }
          ]
        },
        {
          sellerId: 'seller_001',
          items: [
            { productId: 'product_012', name: 'Maggi 2-Minute Noodles', unit: '4-pack', emoji: '🍜', price: 56, qty: 2 }
          ],
          subtotal: 112,
          deliveryFee: 20,
          status: 'preparing',
          history: [
            { status: 'placed', at: '2026-11-09T09:05:00.000Z' },
            { status: 'confirmed', at: '2026-11-09T09:08:00.000Z' },
            { status: 'preparing', at: '2026-11-09T09:12:00.000Z' }
          ]
        }
      ],
      totals: { subtotal: 220, delivery: 45, serviceFee: 10, grandTotal: 275 }
    },
    {
      id: 'GS10003',
      createdAt: '2026-11-09T10:42:00.000Z',
      customer: {
        name: 'Rohit Verma',
        phone: '9800011122',
        address: 'House 7, Vikas Nagar, Sector 2',
        landmark: 'Behind State Bank',
        instructions: ''
      },
      paymentMethod: 'COD',
      sellerOrders: [
        {
          sellerId: 'seller_005',
          items: [
            { productId: 'product_020', name: 'Parle-G Biscuits', unit: '800 g', emoji: '🍪', price: 75, qty: 1 },
            { productId: 'product_019', name: "Lay's Classic Salted", unit: '52 g', emoji: '🍟', price: 20, qty: 2 }
          ],
          subtotal: 115,
          deliveryFee: 20,
          status: 'placed',
          history: [{ status: 'placed', at: '2026-11-09T10:42:00.000Z' }]
        }
      ],
      totals: { subtotal: 115, delivery: 20, serviceFee: 10, grandTotal: 145 }
    }
  ]
};
