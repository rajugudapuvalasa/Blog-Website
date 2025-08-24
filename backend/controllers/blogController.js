const Blog = require('../models/Blog');
const admin = require('../middleware/admin');
// Create blog (image already on Cloudinary via multer-storage-cloudinary)
exports.createBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body || {};
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!content) return res.status(400).json({ error: 'Content is required' });
    if (!req.file?.path) return res.status(400).json({ error: 'Image is required' });
    
    const blog = await Blog.create({
      title,
      content,
      category,
      image: req.file.path,     // Cloudinary secure_url from multer-storage-cloudinary
      author: req.userId
    });

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

// Get all
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

// Get one
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

// Update (optional new image)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    // Allow admin to update any blog
    if (req.userRole !== "admin" && blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    if (req.file?.path) {
      blog.image = req.file.path; // new Cloudinary url
    }

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

// Delete
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    // Allow admin to delete any blog
    if (req.userRole !== "admin" && blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};

// Like/Unlike
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const userId = req.userId;
    const liked = blog.likes.some(id => id.toString() === userId);

    if (liked) blog.likes.pull(userId);
    else blog.likes.push(userId);

    await blog.save();
    res.json({ liked: !liked, likesCount: blog.likes.length });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
};
