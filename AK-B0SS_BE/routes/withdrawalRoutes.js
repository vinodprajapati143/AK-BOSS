const express = require("express");
const router = express.Router();
const withdrawalController = require("../controllers/withdrawalController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post('/create', verifyToken, withdrawalController.createWithdrawalRequest);
router.get('/withdrawl-req',verifyToken, withdrawalController.getWithdrawalsWithBalance);
router.get('/withdrawllist',verifyToken, withdrawalController.getAllWithdrawalRequests);




module.exports = router;

