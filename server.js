require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Models
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');
const Admin = require('./models/Admin');
const crypto = require('crypto');

// Seed admin user on startup if not exists
const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
      
      const defaultAdmin = new Admin({
        username: 'groceryadmin',
        password: hash,
        salt: salt
      });
      await defaultAdmin.save();
      console.log('Default admin user ("groceryadmin") seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedAdmin();
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));


// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid Login' });
    }

    const verifyHash = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, 'sha512').toString('hex');
    if (verifyHash === admin.password) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Login' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, qty } = req.body;
    const newProduct = new Product({ name, price: Number(price), qty: Number(qty) || 0 });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all invoices (for reports)
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Save an invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const { invoice, dateTime, cname, cmobile, items, total, paymentType } = req.body;
    const newInvoice = new Invoice({ invoice, dateTime, cname, cmobile, items, total, paymentType });
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save invoice' });
  }
});

// Delete an invoice
app.delete('/api/invoices/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
