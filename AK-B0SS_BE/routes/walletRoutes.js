const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middlewares/authMiddleware");


router.get('/balance', verifyToken, walletController.getUserWalletBalance);// 10/08/2025 -----> Paid




module.exports = router;
