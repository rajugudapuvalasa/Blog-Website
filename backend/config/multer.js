// multer.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'blog_images', // folder in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

const upload = multer({ storage });

module.exports = upload;
