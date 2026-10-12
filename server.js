require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');
const Product = require('./models/Product');
const seedDB = require('./data/seeder');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coffee_shop_db';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve Static Assets from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Friendly page route rewrites to HTML files
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'orders.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Error handling middleware
app.use(errorHandler);

// Database Connection & Server Initialization
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(` MongoDB Connected successfully to: ${MONGO_URI}`);

    // Auto-seed if database has no products yet
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log(' No products detected in database. Initializing artisan coffee catalog...');
      await seedDB(false);
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(` ☕ BEANCRAFT COFFEE E-COMMERCE SERVER RUNNING`);
      console.log(` 🌐 Web Application : http://localhost:${PORT}`);
      console.log(` 🛒 Catalog Store   : http://localhost:${PORT}/shop`);
      console.log(` 📦 Order Tracking  : http://localhost:${PORT}/orders`);
      console.log(` ⚙️  Admin Dashboard : http://localhost:${PORT}/admin`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error(' MongoDB Connection Failed:', error.message);
    console.log(' Starting server with limited offline capabilities...');
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT} (MongoDB offline)`);
    });
  }
};

startServer();
