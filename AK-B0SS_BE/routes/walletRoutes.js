const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middlewares/authMiddleware");
const urlencodedParser = express.urlencoded({ extended: true });

router.get('/balance', verifyToken, walletController.getUserWalletBalance);// 10/08/2025 -----> Paid
router.get('/check-order-status', verifyToken, walletController.checkOrderStatus);

router.post('/create-order', verifyToken, walletController.createAddMoneyOrder);
router.get('/add-money-list', verifyToken, walletController.getAddMoneyListAllStatus);

router.post('/webhook', urlencodedParser, walletController.ekqrWebhook);




module.exports = router;
