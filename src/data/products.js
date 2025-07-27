// src/data/products.js  – Roman-Urdu comments
const products = [
  {
    id: '001',
    slug: 'indoor-steel-adjustable-silent-treadmill',  // custom URL path
    name: 'Indoor Steel Adjustable Silent Treadmill',
    categories: ['fitness', 'home-gym'],
    sku: 'TM-001',                // SEO schema ke liye, page pe nahi dikhayenge
    stock: 4,                    // 15 → green pill “In Stock”
    rating: 4.8,                  // sirf stars, counts nahi
    reviewCount: 5,              // reviews ki taadad
    images: [
      '/Prod-images/best numbing cream in pakistan.webp',
      '/Prod-images/buy ritalin 10 in lahore.webp',
      '/Prod-images/cialis alternative price in pakistan.webp',
    ],
    price: 300,                 // 1 qty base price
    offerPrice: 270,             // discounted price (lowest qtyDiscount ya actual offer)
    qtyDiscount: {                // jitni qty utna discount
      //1: 300,
      2: 285,
      5: 270,
      8: 250,
    },
    shortDesc: 'Compact, foldable, Bluetooth enabled treadmill for home workouts.',
    longDesc: `
      * **Motor:** 2.25 HP continuous duty  
      * **Speed:** 1 – 14 km/h  
      * **Incline:** 3-level manual  
      * **Features:** App tracking, safety key, hydraulic fold  
    `,
    specialNote:
      '“Free installation & 1-year warranty inside twin-cities only.”',
    related: ['002','004', '003'],      // related products IDs
    metaTitle: 'Indoor Steel Adjustable Silent Treadmill – Best Home Gym in Pakistan',
    metaDescription: 'Compact, foldable & Bluetooth treadmill for home workouts. Free installation & 1-year warranty. Order now for Rs 300 only!',
    ActiveSalt: 'peracitamol, brufine,',
    reviews: [
      {
        date: 'May-15-2024',
        name: 'John Doe',
        rating: 5,
        comment: 'Great product, I use it daily for my health.'
      },
      {
        date: 'Feb-01-2024',
        name: 'Jane Smith',
        rating: 4,
        comment: 'I recommend this to everyone. It’s a good value for money.'
      },
      {
        date: 'Dec-5-2025',
        name: 'Alice Johnson',
        rating: 3,
        comment: 'Not a happy camper - by Ellie, April 1, 2011'
      }
    ]
  },
  {
    id: '002',
    slug: '2nd',  // custom URL path
    name: 'test product',
    categories: ['health', 'medicine'],
    sku: 'TM-002',                // SEO schema ke liye, page pe nahi dikhayenge
    stock: 4.5,                    // 15 → green pill “In Stock”
    rating: 4.8,                  // sirf stars, counts nahi
    reviewCount: 3,              // reviews ki taadad
    images: [
      '/Prod-images/best numbing cream in pakistan.webp',
      '/Prod-images/buy ritalin 10 in lahore.webp',
      '/Prod-images/cialis alternative price in pakistan.webp',
    ],
    price: 500,                 // 1 qty base price
    offerPrice: 450,             // discounted price (lowest qtyDiscount ya actual offer)
    qtyDiscount: {                // jitni qty utna discount
      //1: 500,
      2: 470,
      5: 450,
      8: 420,
    },
    shortDesc: 'Compact, foldable, Bluetooth enabled treadmill for home workouts.',
    longDesc: `
      * **Motor:** 2.25 HP continuous duty  
      * **Speed:** 1 – 14 km/h  
      * **Incline:** 3-level manual  
      * **Features:** App tracking, safety key, hydraulic fold  
    `,
    specialNote:
      '“Free installation & 1-year warranty inside twin-cities only.”',
    related: ['001','004', '003'],      // related products IDs
    metaTitle: 'Indoor Steel Adjustable Silent Treadmill – Best Home Gym in Pakistan',
    metaDescription: 'Compact, foldable & Bluetooth treadmill for home workouts. Free installation & 1-year warranty. Order now for Rs 300 only!',
    ActiveSalt: 'peracitamol, brufine,',
    reviews: [
      {
        date: 'May-15-2024',
        name: 'John Doe',
        rating: 5,
        comment: 'Great product, I use it daily for my health.'
      },
      {
        date: 'Feb-01-2024',
        name: 'Jane Smith',
        rating: 4,
        comment: 'I recommend this to everyone. It’s a good value for money.'
      },
      {
        date: 'Dec-5-2025',
        name: 'Alice Johnson',
        rating: 3,
        comment: 'Not a happy camper - by Ellie, April 1, 2011'
      }
    ]
  },
  {
    id: '003',
    slug: '3rd',  // custom URL path
    name: 'Test 3',
    categories: ['health', 'cat3'],
    sku: 'TM-003',                // SEO schema ke liye, page pe nahi dikhayenge
    stock: 4,                    // 15 → green pill “In Stock”
    rating: 4.8,                  // sirf stars, counts nahi
    reviewCount: 2,              // reviews ki taadad
    images: [
      '/Prod-images/best numbing cream in pakistan.webp',
      '/Prod-images/buy ritalin 10 in lahore.webp',
      '/Prod-images/cialis alternative price in pakistan.webp',
    ],
    price: 300,                 // 1 qty base price
    offerPrice: 270,             // discounted price (lowest qtyDiscount ya actual offer)
    qtyDiscount: {                // jitni qty utna discount
      //1: 300,
      2: 285,
      5: 270,
    },
    shortDesc: 'Compact, foldable, Bluetooth enabled treadmill for home workouts.',
    longDesc: `
      * **Motor:** 2.25 HP continuous duty  
      * **Speed:** 1 – 14 km/h  
      * **Incline:** 3-level manual  
      * **Features:** App tracking, safety key, hydraulic fold  
    `,
    specialNote:
      '“Free installation & 1-year warranty inside twin-cities only.”',
    related: ['001','002', '004'],      // related products IDs
    metaTitle: 'Indoor Steel Adjustable Silent Treadmill – Best Home Gym in Pakistan',
    metaDescription: 'Compact, foldable & Bluetooth treadmill for home workouts. Free installation & 1-year warranty. Order now for Rs 300 only!',
    ActiveSalt: 'peracitamol, brufine,',
    reviews: [
      {
        date: 'May-15-2024',
        name: 'John Doe',
        rating: 5,
        comment: 'Great product, I use it daily for my health.'
      },
      {
        date: 'Feb-01-2024',
        name: 'Jane Smith',
        rating: 4,
        comment: 'I recommend this to everyone. It’s a good value for money.'
      },
      {
        date: 'Dec-5-2025',
        name: 'Alice Johnson',
        rating: 3,
        comment: 'Not a happy camper - by Ellie, April 1, 2011'
      }
    ]
  },
  {
    id: '004',
    slug: '4th',  // custom URL path
    name: '4 test product',
    categories: ['cat3', 'medicine'],
    sku: 'TM-004',                // SEO schema ke liye, page pe nahi dikhayenge
    stock: 0,                    // 15 → green pill “In Stock”
    rating: 4.8,                  // sirf stars, counts nahi
    reviewCount: 3,              // reviews ki taadad
    images: [
      '/Prod-images/best numbing cream in pakistan.webp',
      '/Prod-images/buy ritalin 10 in lahore.webp',
      '/Prod-images/cialis alternative price in pakistan.webp',
    ],
    price: 500,                 // 1 qty base price
    offerPrice: 450,             // discounted price (lowest qtyDiscount ya actual offer)
    qtyDiscount: {                // jitni qty utna discount
      //1: 500,
      2: 490,
      //3: 480,
      4: 470,
      //5: 460,
      6: 450,
      //7: 440,
      8: 430,
      //9: 420,
      10: 410,
    },
    tabsMg: '5 Tabs * 20mg',
    origin: 'Made in Pakistan',
    quality: 'Original not genric',
    shortDesc: 'Compact, foldable, Bluetooth enabled treadmill for home workouts.',
    longDesc: `
      * **Motor:** 2.25 HP continuous duty  
      * **Speed:** 1 – 14 km/h  
      * **Incline:** 3-level manual  
      * **Features:** App tracking, safety key, hydraulic fold  
    `,
    specialNote:
      '“Free installation & 1-year warranty inside twin-cities only.”',
    related: ['001','002', '003'],      // related products IDs
    metaTitle: 'Indoor Steel Adjustable Silent Treadmill – Best Home Gym in Pakistan',
    metaDescription: 'Compact, foldable & Bluetooth treadmill for home workouts. Free installation & 1-year warranty. Order now for Rs 300 only!',
    ActiveSalt: 'peracitamol, brufine,',
    reviews: [
      {
        date: 'May-15-2024',
        name: 'John Doe',
        rating: 5,
        comment: 'Great product, I use it daily for my health.'
      },
      {
        date: 'Feb-01-2024',
        name: 'Jane Smith',
        rating: 4,
        comment: 'I recommend this to everyone. It’s a good value for money.'
      },
      {
        date: 'Dec-5-2025',
        name: 'Alice Johnson',
        rating: 3,
        comment: 'Not a happy camper - by Ellie, April 1, 2011'
      }
    ]
  },
  // … more products
];

export default products;