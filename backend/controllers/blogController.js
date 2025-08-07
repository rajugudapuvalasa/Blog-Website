const Blog = require('../models/Blog');
const cloudinary = require('../middleware/cloudinaryUpload');

exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog-images',
      });
      imageUrl = result.secure_url;
    }

    const blog = new Blog({
      title,
      content,
      image: imageUrl,
      category,
      author: req.userId
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error('Error creating blog:', err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};


exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.userId)
      return res.status(403).json({ error: 'Access denied: Not your blog' });

    const updatedData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.author.toString() !== req.userId)
      return res.status(403).json({ error: 'Access denied: Not your blog' });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
