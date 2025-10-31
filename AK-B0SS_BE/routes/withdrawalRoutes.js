const express = require("express");
const router = express.Router();
const withdrawalController = require("../controllers/withdrawalController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post('/create', verifyToken, withdrawalController.createWithdrawalRequest);//1000
router.get('/withdrawl-req',verifyToken, withdrawalController.getWithdrawalsWithBalance);//1000
router.get('/withdrawllist',verifyToken, withdrawalController.getAllWithdrawalRequests);//1000
router.post('/adminProcessWithdrawal', verifyToken, withdrawalController.adminProcessWithdrawal);//1000





module.exports = router;

