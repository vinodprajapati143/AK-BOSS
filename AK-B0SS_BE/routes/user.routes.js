const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get('/userlist', verifyToken, userController.listUsers);

module.exports = router;