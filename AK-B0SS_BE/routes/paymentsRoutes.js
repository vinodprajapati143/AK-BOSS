const express = require("express");
const router = express.Router();
const paymentsControllers = require("../controllers/paymentsControllers");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post('/save', verifyToken, paymentsControllers.savePaymentDetails);
router.get("/details", verifyToken, paymentsControllers.getPaymentDetails);