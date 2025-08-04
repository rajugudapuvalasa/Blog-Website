const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Blog', blogSchema);
