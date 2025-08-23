const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(cors({
  origin: [
    'https://rajugudapuvalasa.github.io',
    'https://blogwebsite3.netlify.app'
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: "Backend working fine!" });
});

// JSON error handler (so errors don’t return HTML pages)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
