require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('./models/Invoice');

const mockInvoice = {
  invoice: "1005",
  dateTime: new Date().toLocaleString(),
  cname: "Ramesh Kumar",
  cmobile: "9876501234",
  items: [
    { name: "Atta 5kg", price: 350, qty: 1, total: 350 },
    { name: "Rice 10kg", price: 400, qty: 1, total: 400 }
  ],
  total: 750.00,
  gst: 0,
  discount: 0,
  paymentType: "Cash"
};

console.log("Connecting to MongoDB...");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected successfully to MongoDB!");
    
    const existing = await Invoice.findOne({ invoice: "1005" });
    if (existing) {
      console.log("Invoice 1005 already exists. Updating details...");
      await Invoice.findByIdAndUpdate(existing._id, mockInvoice);
      console.log("Invoice 1005 updated!");
    } else {
      const newInvoice = new Invoice(mockInvoice);
      await newInvoice.save();
      console.log("Invoice 1005 saved successfully!");
    }
    
    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Database error:", err);
    process.exit(1);
  });
