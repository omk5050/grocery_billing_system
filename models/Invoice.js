const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoice: {
    type: String,
    required: false
  },
  dateTime: {
    type: String
  },
  cname: {
    type: String,
    required: true
  },
  cmobile: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    price: Number,
    qty: Number,
    total: Number
  }],
  total: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  paymentType: {
    type: String,
    default: "Cash"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
