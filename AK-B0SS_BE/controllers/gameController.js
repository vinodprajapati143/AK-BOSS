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

    // Ab sabhi required columns lo
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, 
              patte1, patte1_open, patte2_close, patte2
       FROM games 
       WHERE created_by = ? 
       ORDER BY id DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: games });
  } catch (err) {
    console.error("Get Game List Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getNearestGames = async (req, res) => {
  try {
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, 
              patte1, patte1_open, patte2_close, patte2,
              status
       FROM games 
       WHERE created_by = ?
       ORDER BY id DESC`,
      [req.user.id]
    );

    const now = new Date();

    const futureOpen = [];
    const allGames = [];

games.forEach(game => {
  const today = new Date().toISOString().split('T')[0];

  const openDateTime = new Date(`${today}T${game.open_time}`);
  const closeDateTime = new Date(`${today}T${game.close_time}`);

  const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
  const openWindowEnd = new Date(openDateTime.getTime() + 60 * 60000);

  const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);
  const closeWindowEnd = new Date(closeDateTime.getTime() + 60 * 60000);

  const now = new Date();

  // Debug print
  console.log(`Game: ${game.game_name}`);
  console.log(`Now: ${now}`);
  console.log(`Open Window: ${openWindowStart} - ${openWindowEnd}, 
               Inside: ${now >= openWindowStart && now <= openWindowEnd}`);
  console.log(`Close Window: ${closeWindowStart} - ${closeWindowEnd}, 
               Inside: ${now >= closeWindowStart && now <= closeWindowEnd}`);

  const insideOpenWindow = now >= openWindowStart && now <= openWindowEnd;
  const insideCloseWindow = now >= closeWindowStart && now <= closeWindowEnd;

  const openInputsFilled = game.patte1 || game.patte1_open;
  const closeInputsFilled = game.patte2_close || game.patte2;

  if ((insideOpenWindow && !openInputsFilled) || (insideCloseWindow && !closeInputsFilled)) {
    console.log('Pushed to futureOpen');
    futureOpen.push(game);
  } else {
    console.log('Pushed to allGames');
    allGames.push(game);
  }
});



    res.json({ futureOpen, allGames });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.saveGameinput = async (req, res) => {
  try {
    const { id, patte1, patte1_open, patte2_close, patte2 } = req.body;

    if (!id) return res.status(400).json({ message: 'Game ID required' });

    let status = null;

    // Status decide karna
    if (patte1 || patte1_open) {
      status = "open";
    }
    if (patte2 || patte2_close) {
      status = "close";
    }

    const sql = `
      UPDATE games 
      SET patte1 = ?, patte1_open = ?, patte2_close = ?, patte2 = ?, status = ?
      WHERE id = ?
    `;
    await db.query(sql, [patte1, patte1_open, patte2_close, patte2, status, id]);

    res.json({ success: true, message: 'Game inputs saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};







