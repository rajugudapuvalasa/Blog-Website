const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // ✅ Multer with Cloudinary storage

const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary Test Route
router.get("/test-cloudinary", async (req, res) => {
  try {
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Routes just point to controller functions
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getSingleBlog);
router.post('/create', auth, upload.single('image'), blogController.createBlog);
router.put('/:id', auth, upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);
router.post('/:id/like', auth, blogController.toggleLike);

module.exports = router;
