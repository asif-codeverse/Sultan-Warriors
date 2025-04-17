const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware'); // Import the auth middleware

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // To parse JSON request body
app.use(cookieParser()); // To parse cookies
app.set('view engine', 'ejs'); // Set EJS as templating engine
app.set('views', path.join(__dirname, 'views')); // Set views directory

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Static Routes
app.get('/home', (req, res) => res.render('home')); // Render home page
app.get('/login', (req, res) => res.render('login')); // Render login page
app.get('/admin', authMiddleware, (req, res) => res.render('admin')); // Protected route for admin page
app.get('/chat', (req, res) => res.render('chat')); // Render chat page
app.get('/dashboard', authMiddleware, (req, res) => res.render('dashboard')); // Protected route for dashboard

// Auth routes (login, register, etc.)
app.use('/api/auth', authRoutes);

// Protected Route Example (API)
app.get('/profile', authMiddleware, (req, res) => {
  // You can fetch user data from the database and send it in response
  res.json({ message: 'Welcome to your profile', user: req.user });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
