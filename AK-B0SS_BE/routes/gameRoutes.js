const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Only admin can add games
router.post("/add-game", verifyToken, gameController.addGame);
router.get("/game-list",verifyToken, gameController.getGameList);

module.exports = router;