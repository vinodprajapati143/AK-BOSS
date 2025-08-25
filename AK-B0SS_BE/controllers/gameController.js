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



