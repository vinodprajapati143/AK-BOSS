const express = require("express");
const router = express.Router();
const withdrawalController = require("../controllers/withdrawalController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post('/create', verifyToken, withdrawalController.createWithdrawalRequest);

module.exports = router;

