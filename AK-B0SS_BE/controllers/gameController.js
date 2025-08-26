const db = require("../config/db");

exports.addGame = async (req, res) => {
  try {
    if (req.user.registerType !== "admin") {
      return res.status(403).json({ message: "Only admin can add games" });
    }

    const { game_name, open_time, close_time, days, prices } = req.body;

        // ---------------- Server-side Validation ----------------
    if (!game_name || game_name.trim() === "") {
      return res.status(400).json({ message: "Game name is required" });
    }

    if (!open_time || open_time.trim() === "") {
      return res.status(400).json({ message: "Open time is required" });
    }

    if (!close_time || close_time.trim() === "") {
      return res.status(400).json({ message: "Close time is required" });
    }

    const [admin] = await db.query("SELECT phone FROM users WHERE id = ?", [req.user.id]);

    const sql = `
      INSERT INTO games (game_name, open_time, close_time, days, prices, created_by, created_by_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      game_name,
      open_time,
      close_time,
      JSON.stringify(days),
      JSON.stringify(prices),
      req.user.id,
      admin[0].phone
    ]);

    res.json({ success: true, message: "Game added successfully" });
  } catch (err) {
    console.error("Add Game Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getGameList = async (req, res) => {
  try {
    if (req.user.registerType !== "admin") {
      return res.status(403).json({ message: "Only admin can view games" });
    }

    // Sirf rows lo
    const [games] = await db.query(
      "SELECT id, game_name, open_time, close_time FROM games WHERE created_by = ? ORDER BY id DESC",
      [req.user.id]
    );

    res.json({ success: true, data: games });
  } catch (err) {
    console.error("Get Game List Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// In-memory cache
let nearestGamesCache = { data: [], timestamp: 0 };
const CACHE_TTL = 30 * 1000; // 30 seconds
exports.getNearestGames = async (req, res) => {
  try {
    const now = new Date();
    const nowMs = now.getTime();

    // Check cache first
    if (nearestGamesCache.data.length && (nowMs - nearestGamesCache.timestamp < CACHE_TTL)) {
      return res.json({ success: true, games: nearestGamesCache.data });
    }

    // ---------------- Optimized DB Query ----------------
    const sql = `
      SELECT id, game_name, open_time, close_time
      FROM games
      WHERE 
        (open_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MIN))
        OR (close_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 MIN))
      ORDER BY 
        LEAST(
          ABS(TIMESTAMPDIFF(SECOND, NOW(), open_time)),
          ABS(TIMESTAMPDIFF(SECOND, NOW(), close_time))
        )
      LIMIT 50
    `;

    const [games] = await db.query(sql);

    // Update cache
    nearestGamesCache = {
      data: games,
      timestamp: nowMs
    };

    res.json({ success: true, games });
  } catch (err) {
    console.error("Get Nearest Games Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.saveGameinput = async (req, res) => {
  try {
    const { id, patte1, patte1_open, patte2_close, patte2 } = req.body;

    if (!id) return res.status(400).json({ message: 'Game ID required' });

    const sql = `
      UPDATE games 
      SET patte1 = ?, patte1_open = ?, patte2_close = ?, patte2 = ?
      WHERE id = ?
    `;
    await db.query(sql, [patte1, patte1_open, patte2_close, patte2, id]);

    res.json({ success: true, message: 'Game inputs saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};






