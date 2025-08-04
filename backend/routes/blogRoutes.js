const express = require('express');
const multer = require('multer');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Get all blogs
router.get('/', blogController.getBlogs);

// ✅ Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create blog
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: req.file?.filename,
      author: req.userId
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create blog', error: err });
  }
});

// Update blog
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.category = req.body.category;
    if (req.file) {
      blog.image = req.file.filename;
    }

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update blog', error: err });
  }
});

// Like toggle
router.post('/like/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const index = blog.likes.indexOf(req.userId);
    if (index === -1) {
      blog.likes.push(req.userId);
      await blog.save();
      return res.json({ liked: true });
    } else {
      blog.likes.splice(index, 1);
      await blog.save();
      return res.json({ liked: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error toggling like', error: err });
  }
});

// ✅ Delete blog only if author
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Like/Unlike a blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const userId = req.userId;
    const liked = blog.likes.includes(userId);

    if (liked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();
    res.json({ liked: !liked, likesCount: blog.likes.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
