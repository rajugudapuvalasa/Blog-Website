const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Use consistent secret key

// ================= Signup =================
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ error: 'Signup failed' });
  }
};

// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
};
