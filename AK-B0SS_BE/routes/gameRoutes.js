const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Public routes (no token required)
router.get("/public-game-list", gameController.getPublicGames);
router.get("/public-game-result", gameController.getPublicGameResults);
router.get('/:gameId/jodi-records', gameController.getJodiRecords);
router.get('/:gameId/panel-records', gameController.getPanelRecords);
// Protected routes (token required)
router.use(verifyToken); // middleware lagao yahan se
router.post("/add-game",  gameController.addGame);
router.get("/game-list", gameController.getGameList);
router.get("/nearest-game-list", gameController.getNearestGames);
router.get("/user-game-list", gameController.getUserBoardGames);
router.post("/save-game-input", gameController.saveGameInput);
router.get('/:id', gameController.getGameById);
router.put('/:id', gameController.updateGameById);
router.post('/single-ank/entry', gameController.addSingleAnk);














module.exports = router;