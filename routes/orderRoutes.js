const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, optionalAuth } = require('../middleware/auth');

// Helper to generate order ID and tracking code
const generateOrderNumber = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ROAST-2026-${randomNum}`;
};

const generateTrackingNumber = () => {
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  return `TRK-BC-${randomCode}`;
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Public (Guest or Authenticated)
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      customerInfo,
      orderItems,
      paymentMethod,
      promoCode,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.address) {
      return res.status(400).json({ success: false, message: 'Please provide complete customer and shipping details' });
    }

    // Verify products & calculate subtotal from database prices
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.productId || item._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      // Check size multiplier
      let sizeMultiplier = 1;
      if (item.size) {
        const foundSize = product.sizes.find(s => s.size === item.size);
        if (foundSize) sizeMultiplier = foundSize.priceMultiplier;
      }

      const unitPrice = Math.round(product.price * sizeMultiplier * 100) / 100;
      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemTotal = unitPrice * quantity;
      subtotal += itemTotal;

      // Update product stock if available
      if (product.stock >= quantity) {
        product.stock -= quantity;
        await product.save();
      }

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.primaryImage,
        size: item.size || '250g',
        grind: item.grind || 'Whole Bean',
        price: unitPrice,
        quantity: quantity
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // Apply promo discounts
    let discount = 0;
    let shippingCost = subtotal >= 40 ? 0 : 5.00;

    if (promoCode) {
      const code = promoCode.trim().toUpperCase();
      if (code === 'COFFEE10') {
        discount = Math.round(subtotal * 0.10 * 100) / 100; // 10% off
      } else if (code === 'FREESHIP') {
        shippingCost = 0;
      } else if (code === 'BEAN20') {
        discount = Math.round(subtotal * 0.20 * 100) / 100; // 20% off
      }
    }

    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100; // 8% sales tax
    const totalAmount = Math.max(0, Math.round((subtotal - discount + shippingCost + tax) * 100) / 100);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user ? req.user._id : null,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        address: customerInfo.address
      },
      orderItems: verifiedItems,
      subtotal,
      discount,
      promoCode: promoCode ? promoCode.toUpperCase() : null,
      shippingCost,
      tax,
      totalAmount,
      paymentMethod: paymentMethod || 'Card',
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      trackingNumber: generateTrackingNumber(),
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
// @access  Private
router.get('/my-orders', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/track/:orderNumber
// @desc    Track order by orderNumber or ID
// @access  Public
router.get('/track/:orderNumber', async (req, res, next) => {
  try {
    const param = req.params.orderNumber.trim();
    let order;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(param);
    }

    if (!order) {
      order = await Order.findOne({
        $or: [
          { orderNumber: { $regex: new RegExp(`^${param}$`, 'i') } },
          { trackingNumber: { $regex: new RegExp(`^${param}$`, 'i') } }
        ]
      });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found with this tracking or order number.' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
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

module.exports = router;
