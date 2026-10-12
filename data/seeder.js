require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { products, users, sampleReviews } = require('./seedData');

const seedDB = async (autoExit = true) => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coffee_shop_db';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected for seeding...');
    }

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing collections...');

    // Seed Users
    const createdUsers = [];
    for (const u of users) {
      const newUser = new User(u);
      await newUser.save();
      createdUsers.push(newUser);
    }
    console.log(`Created ${createdUsers.length} users (including Admin).`);

    // Seed Products
    try {
      await Product.collection.dropIndexes();
    } catch (e) {}

    const productsWithSlugs = products.map(p => ({
      ...p,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));

    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`Created ${createdProducts.length} artisan coffee products.`);

    // Seed Reviews
    for (const r of sampleReviews) {
      const prod = createdProducts[r.productIndex];
      if (prod) {
        await Review.create({
          product: prod._id,
          user: createdUsers[1]._id,
          name: r.name,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verifiedPurchase: true
        });
      }
    }
    console.log('Sample customer reviews seeded.');

    // Seed a sample order for demonstration
    const sampleProduct = createdProducts[0];
    const sampleProduct2 = createdProducts[2];
    await Order.create({
      orderNumber: 'ROAST-2026-9042',
      user: createdUsers[1]._id,
      customerInfo: {
        name: createdUsers[1].name,
        email: createdUsers[1].email,
        phone: createdUsers[1].phone,
        address: createdUsers[1].address
      },
      orderItems: [
        {
          product: sampleProduct._id,
          name: sampleProduct.name,
          image: sampleProduct.primaryImage,
          size: '500g',
          grind: 'Medium (Drip / Chemex)',
          price: Math.round(sampleProduct.price * 1.85 * 100) / 100,
          quantity: 1
        },
        {
          product: sampleProduct2._id,
          name: sampleProduct2.name,
          image: sampleProduct2.primaryImage,
          size: '250g',
          grind: 'Fine (Espresso / Moka Pot)',
          price: sampleProduct2.price,
          quantity: 2
        }
      ],
      subtotal: 75.77,
      discount: 7.57,
      promoCode: 'COFFEE10',
      shippingCost: 0,
      tax: 5.46,
      totalAmount: 73.66,
      paymentMethod: 'Card',
      paymentStatus: 'Paid',
      orderStatus: 'Roasting',
      trackingNumber: 'TRK-BC-984210',
      notes: 'Please leave parcel by the front porch.'
    });
    console.log('Sample demo order created.');

    console.log('Database Seeding Complete!');
    if (autoExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding Error:', error);
    if (autoExit) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedDB(true);
}

module.exports = seedDB;
