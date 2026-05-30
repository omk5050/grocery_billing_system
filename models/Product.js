const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true,
    default: 0
  },
  barcode: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('Product', productSchema);
