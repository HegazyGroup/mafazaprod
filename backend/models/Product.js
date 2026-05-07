const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, unique: true, sparse: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  status: {
    type: String,
    enum: ['idea', 'in-development', 'testing', 'launched', 'discontinued'],
    default: 'idea'
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  description: { type: String },
  targetLaunchDate: { type: Date },
  launchDate: { type: Date },
  price: { type: Number },
  cost: { type: Number },
  stock: { type: Number, default: 0 },
  tags: [{ type: String }],
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
