const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  color: { type: String, default: '#6366f1' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
