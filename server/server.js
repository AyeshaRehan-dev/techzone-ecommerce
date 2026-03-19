require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const serverless = require('serverless-http');
const Product = require('./Product');
const User = require('./User');
const Order = require('./Order');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendWelcomeEmail, sendOrderConfirmation } = require('./emailService');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'techzone-jwt-secret-key-2026';

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// JWT Auth Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token expired or invalid, please login again' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// --- HEALTH CHECK / DIAGNOSTICS ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    env: {
      has_jwt_secret: !!process.env.JWT_SECRET,
      has_mongo_uri: !!process.env.MONGO_URI,
      has_stripe_secret: !!process.env.STRIPE_SECRET_KEY,
      has_email_user: !!process.env.EMAIL_USER,
      node_env: process.env.NODE_ENV
    }
  });
});

// --- AUTH ROUTES ---

// @route   POST /api/auth/signup
// @desc    Register a new user
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (password.length > 20) {
      return res.status(400).json({ message: 'Password must be 20 characters or less' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password needs at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ message: 'Password needs at least one lowercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password needs at least one number' });
    }
    
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save(); // Password is auto-hashed by pre-save hook

    const token = generateToken(user._id, user.role);

    // SEND WELCOME EMAIL (Await to prevent Vercel timeout errors)
    try {
      await sendWelcomeEmail(email, user.username);
    } catch (err) {
      console.error('Email failed:', err);
    }

    res.status(201).json({ 
      success: true, 
      user: { username: user.username, role: user.role, id: user._id },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server Signup Error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or admin
app.post('/api/auth/login', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = username?.trim();
    password = password?.trim();

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    console.log(`Login attempt for: ${username}`);

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      console.warn('WARNING: JWT_SECRET is missing in .env');
    }

    // 1. Check if it's the Admin from .env
    const envAdminUser = process.env.ADMIN_USERNAME || 'admin';
    const envAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

    if ((username === envAdminUser || username === 'admin@techzone.com') && 
        password === envAdminPass) {
      console.log('Admin login successful');
      const token = generateToken('507f1f77bcf86cd799439011', 'admin');
      return res.json({ 
        success: true, 
        user: { username: 'Admin', role: 'admin', id: '507f1f77bcf86cd799439011' },
        token
      });
    }

    // 2. Check Database for regular users
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });

    if (!user) {
      console.log(`Login failed: User ${username} not found`);
      return res.status(401).json({ message: 'User not found' });
    }

    // Use bcrypt compare
    let isMatch = await user.matchPassword(password);
    
    // MIGRATION FALLBACK: If bcrypt fails, check if password was plaintext (legacy accounts)
    if (!isMatch && user.password === password) {
      console.log(`Legacy account detected for ${username}. Migrating to bcrypt...`);
      user.password = password; // Pre-save hook will hash this on save()
      await user.save();
      isMatch = true;
    }

    if (!isMatch) {
      console.log(`Login failed: Incorrect password for ${username}`);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    console.log(`User login successful: ${user.username}`);
    const token = generateToken(user._id, user.role);
    res.json({ 
      success: true, 
      user: { username: user.username, role: user.role, id: user._id },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Login Error', error: error.message });
  }
});

// --- STRIPE PAYMENT ROUTE ---

// @route   POST /api/create-payment-intent
// @desc    Create a Stripe PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Stripe Payment Error', error: error.message });
  }
});

// --- ORDER ROUTES ---

// @route   POST /api/orders
// @desc    Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, shippingAddress, totalPrice, userId, username, paymentMethod, paymentId } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: userId,
      username,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      totalPrice,
      paymentId: paymentId || 'None'
    });

    const createdOrder = await order.save();
    
    // FETCH USER EMAIL FOR CONFIRMATION
    const userObj = await User.findById(userId);
    if (userObj) {
      try {
        await sendOrderConfirmation(userObj.email, createdOrder);
      } catch (err) {
        console.error('Email failed:', err);
      }
    }

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

// @route   GET /api/users
// @desc    Get all users (Admin)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// --- PRODUCT ROUTES ---

// @route   GET /api/products
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
module.exports.handler = serverless(app);
