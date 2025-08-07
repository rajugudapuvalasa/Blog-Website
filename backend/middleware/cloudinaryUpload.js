// middlewares/cloudinaryUpload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog-images', // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png'], // Supported image formats
    transformation: [
      { width: 800, height: 600, crop: 'limit' } // Optional resizing
    ]
  }
});

// Create multer upload middleware using the cloudinary storage
const upload = multer({ storage });

// Export the middleware
module.exports = upload;
