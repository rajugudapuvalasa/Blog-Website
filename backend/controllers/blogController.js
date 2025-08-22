const Blog = require('../models/Blog');
const cloudinary = require("../config/cloudinary");

// ✅ Create Blog
exports.createBlog = async (req, res) => {
  try {
     console.log("Incoming blog data:", req.body);
    console.log("Incoming file:", req.file);

    const { title, category, content } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!content) return res.status(400).json({ error: 'Content is required' });
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized: userId missing' });
    }
    
    const newBlog = new Blog({
      title,
      content,
      category,
      image: req.file.path, // Cloudinary URL
      author: req.userId
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

// ✅ Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.status(200).json(blogs);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

// ✅ Get Single Blog
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

// ✅ Update Blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied: Not your blog' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    if (req.file) {
      blog.image = req.file.path; // New Cloudinary URL
    }

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Update Blog Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// ✅ Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied: Not your blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};

// ✅ Like / Unlike Blog
exports.toggleLike = async (req, res) => {
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
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};
