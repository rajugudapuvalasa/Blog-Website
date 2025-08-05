const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Required to serve frontend
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(cors({
  origin: ['https://rajugudapuvalasa.github.io', 'https://blogwebsite3.netlify.app'],
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT;
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

app.get('/api/auth/test', (req, res) => {
  res.json({ message: "Backend working fine!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${process.env.PORT || 7000}`);
});
