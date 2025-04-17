const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv'); // for environment variables
const authRoutes = require('./routes/auth');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());  // For parsing JSON bodies
app.use(cookieParser());  // For parsing cookies
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // Make sure this points to the correct 'views' folder

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mental_health', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);  // Exit with failure if connection fails
  });

// Route definitions
app.get('/home', (req, res) => {
    res.render('home'); // renders home.ejs
});

app.get('/login', (req, res) => {
    res.render('login'); // renders login.ejs
});

app.get('/admin', (req, res) => {
    res.render('admin'); // renders admin.ejs
});

app.get('/chat', (req, res) => {
    res.render('chat'); // renders chat.ejs
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard'); // renders dashboard.ejs
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
