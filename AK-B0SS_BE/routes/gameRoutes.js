const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Only admin can add games
router.post("/add-game", verifyToken, gameController.addGame);
router.get("/game-list",verifyToken, gameController.getGameList);
router.get("/nearest-game-list",verifyToken, gameController.getNearestGames);
router.post("/save-game-input",verifyToken, gameController.saveGameInput);
router.get("/public-game-list", gameController.getPublicGames);
router.get("/public-game-result", gameController.getPublicGameResults);
router.get('/:id',verifyToken, gameController.getGameById);
router.put('/:id',verifyToken, gameController.updateGameById);
router.get('/:gameId/jodi-records', gameController.getJodiRecords);
router.get('/:gameId/panel-records', gameController.getPanelRecords);










module.exports = router;