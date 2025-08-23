const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // multer-storage-cloudinary
const cloudinary = require('../config/cloudinary');

// Test Cloudinary (GET in browser)
router.get('/test-cloudinary', async (req, res) => {
  try {
    // public image to avoid signature
    const r = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      { folder: 'test' }
    );
    res.json({ success: true, url: r.secure_url });
  } catch (e) {
    console.error('Cloudinary Error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Blogs
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getSingleBlog);
router.post('/create', auth, upload.single('image'), blogController.createBlog);
router.put('/:id', auth, upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);

router.post('/:id/like', auth, blogController.toggleLike);

module.exports = router;
