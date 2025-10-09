const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get('/user-list', verifyToken, userController.listUsers);// 10/08/2025 -----> Paid
router.get('/referral-code', verifyToken, userController.getReferralCode);// 10/08/2025 -----> Paid
router.get('/referralList', verifyToken, userController.getReferralList);// 10/08/2025 -----> Paid
router.get("/profile", verifyToken, userController.getUserProfile);// 10/08/2025 -----> Paid
router.put("/update-profile", verifyToken, userController.updateUserProfile);// 10/08/2025 -----> Paid


router.get('/user-list-with-bal', verifyToken, userController.getAllUsersWithBalance);




module.exports = router;