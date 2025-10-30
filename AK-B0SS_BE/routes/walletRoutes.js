const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middlewares/authMiddleware");
const urlencodedParser = express.urlencoded({ extended: true });

router.get('/balance', verifyToken, walletController.getUserWalletBalance);// 10/08/2025 -----> Paid
router.get('/check-order-status', verifyToken, walletController.checkOrderStatus); //1500

router.post('/create-order', verifyToken, walletController.createAddMoneyOrder);//1500
router.get('/add-money-list', verifyToken, walletController.getAddMoneyListAllStatus); // 1000

router.post('/webhook', urlencodedParser, walletController.ekqrWebhook);//1500




module.exports = router;
