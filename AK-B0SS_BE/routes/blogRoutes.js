const express = require('express');
const router = express.Router();
const multer = require('multer');
const blogController  = require('../controllers/blogController');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');



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
router.post('/create', upload.single('image'),verifyToken, blogController.createBlog);
router.get('/lists',verifyToken, blogController.getBlogs);
router.post('/:id/status', verifyToken, blogController.updateBlogStatus);

module.exports = router;