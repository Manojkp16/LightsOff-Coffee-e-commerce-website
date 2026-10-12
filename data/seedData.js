const products = [
  {
    name: "Ethiopian Yirgacheffe Reserve",
    subtitle: "Floral Jasmine, Bergamot & Meyer Lemon",
    description: "Hand-picked from the high-altitude highlands of Yirgacheffe at 2,100 meters. This celebrated single-origin coffee showcases a delicate tea-like body with vibrant jasmine aromas, hints of bergamot citrus, and a silky honeycomb sweetness on the finish. A true delight for pour-over and drip lovers.",
    price: 21.50,
    originalPrice: 25.00,
    category: "Single Origin",
    roastLevel: "Light",
    roastMeter: 2,
    origin: "Yirgacheffe, Ethiopia",
    elevation: "1,950 - 2,200m",
    process: "Washed & Sun-dried on raised beds",
    flavorNotes: ["Jasmine", "Bergamot", "Meyer Lemon", "Wild Honey"],
    acidity: "Bright",
    body: "Silky",
    primaryImage: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 45,
    rating: 4.9,
    numReviews: 38,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "Sumatra Mandheling Dark",
    subtitle: "Dark Chocolate, Cedarwood & Molasses",
    description: "Sourced from smallholder estates on the volcanic slopes of Mount Leuser in northern Sumatra. Prepared using the traditional Giling Basah (wet-hulled) method, this deep roast delivers an intensely heavy, velvety body with earthy herbal tones, baker's chocolate, and a rich, smoky molasses finish.",
    price: 19.50,
    originalPrice: 22.00,
    category: "Single Origin",
    roastLevel: "Dark",
    roastMeter: 5,
    origin: "Aceh & Lintong, Sumatra",
    elevation: "1,200 - 1,500m",
    process: "Wet-Hulled (Giling Basah)",
    flavorNotes: ["Dark Chocolate", "Cedarwood", "Molasses", "Warm Spice"],
    acidity: "Low",
    body: "Full",
    primaryImage: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 60,
    rating: 4.8,
    numReviews: 29,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "Velvet Crema Espresso Blend",
    subtitle: "Caramelized Hazelnut, Toffee & Cocoa Nibs",
    description: "Our signature flagship espresso blend, engineered specifically for velvety textured shots and silky milk drinks. A harmonious harmony of washed Colombian Arabica and sun-dried Brazilian Bourbon, creating a thick golden crema, deep cocoa notes, and a round toffee sweetness that shines in lattes and flat whites.",
    price: 18.00,
    originalPrice: null,
    category: "Espresso Blends",
    roastLevel: "Medium-Dark",
    roastMeter: 4,
    origin: "Colombia & Cerrado Mineiro, Brazil",
    elevation: "1,400 - 1,800m",
    process: "Washed & Natural Blend",
    flavorNotes: ["Caramel", "Hazelnut", "Toffee", "Velvety Cocoa"],
    acidity: "Balanced",
    body: "Syrupy",
    primaryImage: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 80,
    rating: 4.9,
    numReviews: 64,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: "Colombia Huila Supremo",
    subtitle: "Red Apple, Brown Sugar & Roasted Almonds",
    description: "Grown by a cooperative of multi-generational coffee farming families in Huila, nestled between the Central and Eastern ranges of the Andes. Offers remarkable balance with juicy red apple sweetness, notes of roasted almond, and a comforting brown sugar aftertaste. The quintessential everyday specialty coffee.",
    price: 19.00,
    originalPrice: 21.50,
    category: "Single Origin",
    roastLevel: "Medium",
    roastMeter: 3,
    origin: "Huila Department, Colombia",
    elevation: "1,650 - 1,900m",
    process: "Fully Washed, Patio Dried",
    flavorNotes: ["Red Apple", "Brown Sugar", "Roasted Almond", "Milk Chocolate"],
    acidity: "Balanced",
    body: "Medium",
    primaryImage: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 50,
    rating: 4.7,
    numReviews: 22,
    isFeatured: false,
    isBestSeller: false
  },
  {
    name: "Guatemala Antigua Los Volcanes",
    subtitle: "Milk Chocolate, Candied Orange & Nutmeg",
    description: "Nestled between three majestic volcanoes in the Antigua valley. The mineral-rich volcanic soil and cool mountain nights impart complex depth, producing a cup with sweet milk chocolate, gentle candied orange zest, and a subtle dusting of warming spice and nutmeg.",
    price: 20.00,
    originalPrice: null,
    category: "Single Origin",
    roastLevel: "Medium",
    roastMeter: 3,
    origin: "Antigua Valley, Guatemala",
    elevation: "1,500 - 1,750m",
    process: "Washed & Sun-Dried",
    flavorNotes: ["Milk Chocolate", "Candied Orange", "Nutmeg", "Pecan"],
    acidity: "Balanced",
    body: "Medium",
    primaryImage: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 35,
    rating: 4.8,
    numReviews: 19,
    isFeatured: true,
    isBestSeller: false
  },
  {
    name: "Cold Brew Reserve Blend",
    subtitle: "Dark Cherry, Vanilla Bean & Dark Chocolate",
    description: "Carefully roasted specifically for cold immersion brewing. Coarsely ground or whole bean, this blend combines naturally sweet African and Latin American beans to yield an ultra-smooth, low-acidity brew with rich notes of dark cherry cordial and melted bittersweet chocolate. Zero bitterness.",
    price: 18.50,
    originalPrice: 22.00,
    category: "Cold Brew",
    roastLevel: "Medium-Dark",
    roastMeter: 4,
    origin: "Guatemala & Ethiopia",
    elevation: "1,600m+",
    process: "Dual Washed & Natural blend",
    flavorNotes: ["Dark Cherry", "Vanilla Bean", "Bittersweet Chocolate"],
    acidity: "Low",
    body: "Full",
    primaryImage: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 75,
    rating: 4.9,
    numReviews: 41,
    isFeatured: false,
    isBestSeller: true
  },
  {
    name: "Costa Rica Tarrazú Honey Process",
    subtitle: "Yellow Plum, Maple Syrup & Golden Honey",
    description: "From the renowned Tarrazú canton of Costa Rica. Using the meticulous Yellow Honey process where mucilage remains on the bean while drying under the mountain sun. This yields an unforgettable cup loaded with honey sweetness, juicy stone fruit, and a clean caramel finish.",
    price: 22.50,
    originalPrice: null,
    category: "Single Origin",
    roastLevel: "Light",
    roastMeter: 2,
    origin: "Tarrazú, Costa Rica",
    elevation: "1,700 - 1,950m",
    process: "Yellow Honey Process",
    flavorNotes: ["Yellow Plum", "Maple Syrup", "Golden Honey", "Apricot"],
    acidity: "Bright",
    body: "Silky",
    primaryImage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 28,
    rating: 4.9,
    numReviews: 16,
    isFeatured: false,
    isBestSeller: false
  },
  {
    name: "Swiss Water Colombia Decaf",
    subtitle: "Swiss Water Process • Graham Cracker & Sweet Cocoa",
    description: "100% chemical-free decaffeination using pure mountain water from British Columbia to gently remove caffeine while preserving the delicate terroir of premium Colombian coffee. Delivers all the full flavor, aroma, and sweet body of authentic specialty coffee without the jitters.",
    price: 19.00,
    originalPrice: null,
    category: "Decaf",
    roastLevel: "Medium",
    roastMeter: 3,
    origin: "Antioquia, Colombia",
    elevation: "1,550m",
    process: "Swiss Water Process (99.9% Caffeine Free)",
    flavorNotes: ["Graham Cracker", "Sweet Cocoa", "Roasted Walnut"],
    acidity: "Low",
    body: "Medium",
    primaryImage: "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "250g", priceMultiplier: 1.0 },
      { size: "500g", priceMultiplier: 1.85 },
      { size: "1kg", priceMultiplier: 3.4 }
    ],
    grindOptions: [
      "Whole Bean",
      "Coarse (French Press / Cold Brew)",
      "Medium (Drip / Chemex)",
      "Fine (Espresso / Moka Pot)"
    ],
    stock: 35,
    rating: 4.6,
    numReviews: 14,
    isFeatured: false,
    isBestSeller: false
  },
  {
    name: "Artisan Matte Black Gooseneck Kettle",
    subtitle: "Precision Pour Spout & Built-in Thermometer",
    description: "Crafted from food-grade stainless steel with an ergonomic walnut handle. The balanced counterweight and slender gooseneck spout offer pinpoint control over your water flow, essential for extracting the ultimate clarity from your pour-over brews.",
    price: 49.00,
    originalPrice: 58.00,
    category: "Artisan Gear",
    roastLevel: "N/A",
    roastMeter: 3,
    origin: "Artisan Equipment",
    elevation: "N/A",
    process: "Precision Stainless Steel",
    flavorNotes: ["Precision Flow", "Ergonomic Wood Grip", "Built-in Dial"],
    acidity: "None",
    body: "None",
    primaryImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: [
      { size: "Standard 850ml", priceMultiplier: 1.0 }
    ],
    grindOptions: ["Standard Unit"],
    stock: 20,
    rating: 5.0,
    numReviews: 12,
    isFeatured: true,
    isBestSeller: false
  }
];

const users = [
  {
    name: "Admin Roaster",
    email: "admin@beancraft.com",
    password: "adminpassword123",
    role: "admin",
    phone: "+1 (555) 019-2834",
    address: {
      street: "101 Artisan Boulevard",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    }
  },
  {
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    password: "coffeeuser123",
    role: "customer",
    phone: "+1 (555) 438-9210",
    address: {
      street: "742 Evergreen Terrace",
      city: "Portland",
      state: "OR",
      zipCode: "97201",
      country: "USA"
    }
  }
];

const sampleReviews = [
  {
    productIndex: 0,
    name: "Elena Rostova",
    rating: 5,
    title: "Best Ethiopian I have ever brewed",
    comment: "The jasmine floral aroma fills the whole kitchen when blooming in the V60! Incredible clarity and delicate citrus notes."
  },
  {
    productIndex: 0,
    name: "Marcus Vance",
    rating: 5,
    title: "Silky and tea-like",
    comment: "Sublime acidity, naturally sweet finish. You do not even need sugar with this bean."
  },
  {
    productIndex: 1,
    name: "David Kim",
    rating: 5,
    title: "Bold, rich, no bitterness",
    comment: "Heavy dark chocolate and cedarwood note that holds up wonderfully with a splash of oat milk in the morning."
  },
  {
    productIndex: 2,
    name: "Claire Bennett",
    rating: 5,
    title: "Golden Crema Perfection",
    comment: "Pulled this on my Gaggia Classic Pro. The hazelnut aroma and toffee sweetness make the best flat white!"
  }
];

module.exports = { products, users, sampleReviews };
