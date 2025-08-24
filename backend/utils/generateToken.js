const jwt = require('jsonwebtoken');

module.exports = function generateToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      username: user.username,
      role: user.role || 'user'
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};
