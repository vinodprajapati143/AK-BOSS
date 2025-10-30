const express = require("express");
const router = express.Router();
const paymentsControllers = require("../controllers/paymentsControllers");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post('/save', verifyToken, paymentsControllers.savePaymentDetails);//1000
router.get("/details", verifyToken, paymentsControllers.getPaymentDetails);//1000

module.exports = router;
