const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get('/user-list', verifyToken, userController.listUsers);
router.get('/referral-code', verifyToken, userController.getReferralCode);
router.get('/referralList', verifyToken, userController.getReferralList);
router.get("/profile", verifyToken, userController.getUserProfile);



module.exports = router;