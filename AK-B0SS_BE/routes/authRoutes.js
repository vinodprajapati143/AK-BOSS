const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);// 10/08/2025 -----> Paid
router.post('/login', authController.loginUser);// 10/08/2025 -----> Paid
router.post('/logout', authController.logoutUser);// 10/08/2025 -----> Paid

// Add forgot-password related:
router.post("/send-forgot-otp", authController.sendForgotOtp);// 10/08/2025 -----> Paid
router.post("/reset-password", authController.verifyOtpAndResetPassword);// 10/08/2025 -----> Paid






module.exports = router;