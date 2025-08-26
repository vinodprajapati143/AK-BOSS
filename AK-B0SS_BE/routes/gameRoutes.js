const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Only admin can add games
router.post("/add-game", verifyToken, gameController.addGame);
router.get("/game-list",verifyToken, gameController.getGameList);
router.get("/nearest-game-list",verifyToken, gameController.getGameList);
router.post("/save-game-input",verifyToken, gameController.saveGameinput);



module.exports = router;