const Blog = require('../models/Blog');

// ✅ Create Blog
exports.createBlog = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set in auth middleware
    const userName = req.user.name; // If you store name in token

    const { title, category, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    if (!title || !category || !content || !imagePath) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      imageUrls:imagePath,
      author: userName, // ✅ Set author from logged-in user
      authorId: userId, // ✅ Store ID for reference
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get All Blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

// ✅ Get Single Blog by ID
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
      blog.image = `/uploads/${req.file.filename}`;
    }

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (err) {
    console.error('Update Blog Error:', err);
    res.status(500).json({ error: 'Failed to update blog' });
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

// ✅ Like/Unlike Blog
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
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
