const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary'); // ✅ Cloudinary config

// ✅ Create Blog with Cloudinary image upload
exports.createBlog = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!content) return res.status(400).json({ error: 'Content is required' });
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    // ✅ Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog_images'
    });

    const newBlog = new Blog({
      title,
      content,
      category,
      image: uploadResult.secure_url, // ✅ Save Cloudinary URL
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

// ✅ Get Single Blog by ID
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

// ✅ Update Blog with optional Cloudinary upload
exports.updateBlog = async (req, res) => {
  try {
    console.log('Update Blog Request Params:', JSON.stringify(req.params, null, 2));
    console.log('Update Blog Request Body:', JSON.stringify(req.body, null, 2));
    console.log('Update Blog Request UserId:', req.userId);
    if (req.file) {
      console.log('Update Blog Request File:', req.file.originalname);
    } else {
      console.log('No file uploaded in update request.');
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.error('Blog not found for update:', req.params.id);
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author.toString() !== req.userId) {
      console.error('Access denied: Not your blog. Blog author:', blog.author, 'User:', req.userId);
      return res.status(403).json({ error: 'Access denied: Not your blog' });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;

    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'blog_images'
        });
        blog.image = uploadResult.secure_url;
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(500).json({ error: 'Image upload failed: ' + (cloudErr.message || cloudErr) });
      }
    }

    await blog.save();
    res.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Update Blog Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
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
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
};
