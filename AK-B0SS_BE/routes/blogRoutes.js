const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBlog } = require('../controllers/blogController');

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// API
router.post('/create', upload.single('image'), createBlog);

module.exports = router;