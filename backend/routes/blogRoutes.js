const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');


// ✅ Routes just point to controller functions
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getSingleBlog);
router.post('/', auth, upload.single('image'), blogController.createBlog);
router.put('/:id', auth, upload.single('image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);
router.post('/:id/like', auth, blogController.toggleLike);

module.exports = router;
