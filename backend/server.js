const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Required to serve frontend
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend files (assumes frontend folder is in the root project)
app.use(express.static(path.join(__dirname, '../docs')));


// Serve index.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/index.html'));
});

app.get('/api/auth/test', (req, res) => {
  res.json({ message: "Backend working fine!" });
});

// Start server
app.listen(process.env.PORT || 7000, () => {
  console.log(`Server started on port ${process.env.PORT || 7000}`);
});
