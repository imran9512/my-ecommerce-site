// src/data/products.js  – Roman-Urdu comments
const products = [
  {
    id: '001',
    slug: 'indoor-steel-adjustable-silent-treadmill',  // custom URL path
    name: 'Indoor Steel Adjustable Silent Treadmill',
    sku: 'TM-001',                // SEO schema ke liye, page pe nahi dikhayenge
    stock: 4,                    // 15 → green pill “In Stock”
    rating: 4.8,                  // sirf stars, counts nahi
    images: [
      '/Prod-images/best numbing cream in pakistan.webp',
      '/Prod-images/buy ritalin 10 in lahore.webp',
      '/Prod-images/cialis alternative price in pakistan.webp',
    ],
    price: 300,                 // 1 qty base price
    qtyDiscount: {                // jitni qty utna discount
      1: 300,
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
    related: ['002', '003'],      // related products IDs
  },
  // … more products
];

export default products;