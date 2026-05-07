const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET all products
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate('category', 'name color')
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name color')
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Stats
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Product.countDocuments();
    res.json({ total, byStatus: stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
