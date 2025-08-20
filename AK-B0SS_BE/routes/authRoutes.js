const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

// Add forgot-password related:
router.post("/send-forgot-otp", authController.sendForgotOtp);
router.post("/reset-password", authController.verifyOtpAndResetPassword);


module.exports = router;