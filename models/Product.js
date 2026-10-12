const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  originalPrice: {
    type: Number,
    default: null
  },
  category: {
    type: String,
    required: true,
    enum: ['Single Origin', 'Espresso Blends', 'Decaf', 'Cold Brew', 'Artisan Gear']
  },
  roastLevel: {
    type: String,
    enum: ['Light', 'Medium', 'Medium-Dark', 'Dark', 'All', 'N/A'],
    default: 'Medium'
  },
  roastMeter: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  origin: {
    type: String,
    default: 'Artisan Blend'
  },
  elevation: {
    type: String,
    default: '1,500m+'
  },
  process: {
    type: String,
    default: 'Washed'
  },
  flavorNotes: {
    type: [String],
    default: []
  },
  acidity: {
    type: String,
    enum: ['Bright', 'Balanced', 'Low', 'Mellow', 'None'],
    default: 'Balanced'
  },
  body: {
    type: String,
    enum: ['Light', 'Silky', 'Medium', 'Full', 'Syrupy', 'None'],
    default: 'Medium'
  },
  primaryImage: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  sizes: [
    {
      size: { type: String, required: true }, // e.g. "250g", "500g", "1kg"
      priceMultiplier: { type: Number, default: 1 }
    }
  ],
  grindOptions: {
    type: [String],
    default: [
      'Whole Bean',
      'Coarse (French Press / Cold Brew)',
      'Medium (Drip / Chemex)',
      'Fine (Espresso / Moka Pot)'
    ]
  },
  stock: {
    type: Number,
    default: 50,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate slug before validate / save if not provided
productSchema.pre('validate', function() {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Product', productSchema);
