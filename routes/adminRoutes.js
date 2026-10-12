const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const seedDB = require('../data/seeder');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics & overview
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['Placed', 'Roasting'] } });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(6);

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingOrders,
        lowStockProducts
      },
      recentOrders
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders with filter
// @access  Private/Admin
router.get('/orders', protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', protect, adminOnly, async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Placed', 'Roasting', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/admin/seed-reset
// @desc    Reset database to sample dataset
// @access  Private/Admin
router.post('/seed-reset', protect, adminOnly, async (req, res, next) => {
  try {
    await seedDB(false);
    res.json({
      success: true,
      message: 'Database successfully refreshed with artisan coffee seed dataset!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
