require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const serverless = require('serverless-http');
const Product = require('./Product');
const User = require('./User');
const Order = require('./Order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ORDER ROUTES ---

// @route   POST /api/orders
// @desc    Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, userId, username } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: userId,
      username,
      items,
      shippingAddress,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// @route   GET /api/orders/myorders/:userId
// @desc    Get logged in user orders
app.get('/api/orders/myorders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// --- AUTH ROUTES ---

// @route   POST /api/auth/signup
// @desc    Register a new user
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ 
      success: true, 
      user: { username: user.username, role: user.role },
      token: 'mock-token-' + user._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or admin
app.post('/api/auth/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username?.trim();
    password = password?.trim();

    console.log(`Login attempt for: ${username}`);

    // 1. Check if it's the Admin from .env (match username or email)
    if ((username === process.env.ADMIN_USERNAME || username === 'admin@techzone.com') && 
        password === process.env.ADMIN_PASSWORD) {
      console.log('Admin login successful');
      return res.json({ 
        success: true, 
        user: { username: 'Admin', role: 'admin', id: '507f1f77bcf86cd799439011' },
        token: 'mock-admin-token-123' 
      });
    }

    // 2. Check Database for regular users (match username OR email)
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });

    if (!user) {
      console.log(`Login failed: User ${username} not found`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
      console.log(`Login failed: Incorrect password for ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`User login successful: ${user.username}`);
    res.json({ 
      success: true, 
      user: { username: user.username, role: user.role, id: user._id },
      token: 'mock-token-' + user._id 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Connect to MongoDB
connectDB();

// Routes

// @route   GET /api/products
// @desc    Get all products or search
// @access  Public
app.get('/api/products', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/products
// @desc    Add a new product
// @access  Public
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error adding product', error });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Public
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Public
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, console.log(`Server running on port ${PORT}`));

module.exports = app;
module.exports.handler = serverless(app);
