const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middlewares/authMiddleware");


router.get('/balance', verifyToken, walletController.getUserWalletBalance);// 10/08/2025 -----> Paid
router.get('/check-order-status', verifyToken, walletController.checkOrderStatus);

router.post('/create-order', verifyToken, walletController.createAddMoneyOrder);
router.post('/webhook', walletController.ekqrWebhook);




module.exports = router;
