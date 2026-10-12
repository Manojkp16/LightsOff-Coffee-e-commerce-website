const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filters, search, sort
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, roastLevel, search, sort, minPrice, maxPrice, featured, bestSeller } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (roastLevel && roastLevel !== 'All') {
      query.roastLevel = roastLevel;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (bestSeller === 'true') {
      query.isBestSeller = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { subtitle: searchRegex },
        { origin: searchRegex },
        { flavorNotes: searchRegex },
        { description: searchRegex }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'name') {
      sortOption = { name: 1 };
    }

    const products = await Product.find(query).sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const featured = await Product.find({ isFeatured: true }).limit(6);
    res.json({
      success: true,
      data: featured
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID or slug
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id/reviews
// @desc    Get reviews for a product
// @access  Public
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const { id } = req.params;
    let productId = id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const prod = await Product.findOne({ slug: id });
      if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });
      productId = prod._id;
    }

    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create a product review
// @access  Public (optional auth)
router.post('/:id/reviews', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    let productId = id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const prod = await Product.findOne({ slug: id });
      if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });
      productId = prod._id;
    }

    const { name, rating, title, comment } = req.body;

    if (!rating || !comment || (!name && !req.user)) {
      return res.status(400).json({ success: false, message: 'Please provide rating, reviewer name, and comment' });
    }

    const reviewerName = req.user ? req.user.name : name;

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : null,
      name: reviewerName,
      rating: Number(rating),
      title: title || '',
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create a product (Admin only)
// @access  Private / Admin
router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private / Admin
router.put('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private / Admin
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete associated reviews
    await Review.deleteMany({ product: product._id });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
