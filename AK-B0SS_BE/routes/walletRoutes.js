const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get('/balance', verifyToken, walletController.getUserWalletBalance);

module.exports = router;
