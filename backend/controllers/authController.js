const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, password are required' });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({ username, email, password });
    const token = generateToken(user);

    res.status(201).json({
      message: 'Signup successful',
      token,
      userId: user._id,
      username: user.username
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      username: user.username
    });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};
