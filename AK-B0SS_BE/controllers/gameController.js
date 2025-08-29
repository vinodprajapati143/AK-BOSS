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

// exports.getNearestGames = async (req, res) => {
//   try {
//     const now = new Date();
//     const offset = 5.5 * 60 * 60 * 1000; // IST offset
//     const nowIST = new Date(now.getTime() + offset);
//     const year = nowIST.getFullYear();
//     const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
//     const day = nowIST.getDate().toString().padStart(2, '0');
//     const todayIST = `${year}-${month}-${day}`;

//     // Get all games for admin
//     const [games] = await db.query(
//       `SELECT id, game_name, open_time, close_time, days 
//        FROM games WHERE created_by = ? ORDER BY id DESC`, [req.user.id]
//     );

//     // Fetch inputs for today for all games
//     const gameIds = games.map(g => g.id);
//     let inputsMap = {};
//     if (gameIds.length > 0) {
//       const [inputs] = await db.query(
//         `SELECT * FROM game_inputs WHERE game_id IN (?) AND input_date = ?`,
//         [gameIds, todayIST]
//       );
//       inputs.forEach(input => {
//         inputsMap[input.game_id] = input;
//       });
//     }

//     const futureOpen = [];
//     const allGames = [];

//     games.forEach(game => {
//       // Add inputs if exists
//       const input = inputsMap[game.id] || {};
//       game.patte1 = input.patte1 || "";
//       game.patte1_open = input.patte1_open || "";
//       game.patte2_close = input.patte2_close || "";
//       game.patte2 = input.patte2 || "";

//       const openDateTime = new Date(`${todayIST}T${game.open_time}`);
//       const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

//       const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
//       const openWindowEnd = new Date(openDateTime.getTime() + 60 * 60000);
//       const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);
//       const closeWindowEnd = new Date(closeDateTime.getTime() + 60 * 60000);

//       const insideOpenWindow = nowIST >= openWindowStart && nowIST <= openWindowEnd;
//       const insideCloseWindow = nowIST >= closeWindowStart && nowIST <= closeWindowEnd;

//       const openInputsFilled = game.patte1 || game.patte1_open;
//       const closeInputsFilled = game.patte2_close || game.patte2;

//       if ((insideOpenWindow && !openInputsFilled) || (insideCloseWindow && !closeInputsFilled)) {
//         futureOpen.push(game);
//       } else {
//         allGames.push(game);
//       }
//     });

//     res.json({ futureOpen, allGames });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

 
exports.getNearestGames = async (req, res) => {
  try {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset
    const nowIST = new Date(now.getTime() + offset);
    const year = nowIST.getFullYear();
    const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
    const day = nowIST.getDate().toString().padStart(2, '0');
    const todayIST = `${year}-${month}-${day}`;

    // Get all games for admin
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days, created_at 
       FROM games WHERE created_by = ? ORDER BY id DESC`, 
       [req.user.id]
    );

    // Fetch inputs for today for all games
    const gameIds = games.map(g => g.id);
    let inputsMap = {};
    if (gameIds.length > 0) {
      const [inputs] = await db.query(
        `SELECT * FROM game_inputs WHERE game_id IN (?) AND input_date = ?`,
        [gameIds, todayIST]
      );
      inputs.forEach(input => {
        inputsMap[input.game_id] = input;
      });
    }

    const futureOpen = [];
    const allGames = [];

    for (const game of games) {
      // Add inputs if exists
      const input = inputsMap[game.id] || {};
      game.patte1 = input.patte1 || "";
      game.patte1_open = input.patte1_open || "";
      game.patte2_close = input.patte2_close || "";
      game.patte2 = input.patte2 || "";

      // -------------------------------
      // ✅ NEW FLOW: created_at → cutoff → masking
      // -------------------------------
      const createdAt = new Date(game.created_at);
      const cutoffTime = new Date(`${todayIST}T14:00:00`); // 2PM cutoff
      const maskEndTime = new Date(`${todayIST}T15:30:00`); // 3:30PM masking end

      if (nowIST <= cutoffTime && nowIST >= createdAt) {
        // 👉 Show inputs normally (no masking)
        // nothing extra to do (game already has inputs attached)
      } else if (nowIST > cutoffTime && nowIST <= maskEndTime) {
        // 👉 Mask inputs with ***
        game.patte1 = "***";
        game.patte1_open = "***";
        game.patte2_close = "***";
        game.patte2 = "***";
      } else if (nowIST > maskEndTime) {
        // 👉 Move to futureOpen and auto-create a new input record if not exists
        const [existing] = await db.query(
          `SELECT id FROM game_inputs WHERE game_id = ? AND input_date = ?`,
          [game.id, todayIST]
        );
        if (existing.length === 0) {
          await db.query(
            `INSERT INTO game_inputs (game_id, input_date, created_at) VALUES (?, ?, NOW())`,
            [game.id, todayIST]
          );
        }
        futureOpen.push(game);
        continue; // skip normal future logic (already handled)
      }

      // -------------------------------
      // ✅ ORIGINAL FUTURE WINDOW LOGIC (keep as it is)
      // -------------------------------
      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      const openWindowEnd = new Date(openDateTime.getTime() + 60 * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);
      const closeWindowEnd = new Date(closeDateTime.getTime() + 60 * 60000);

      const insideOpenWindow = nowIST >= openWindowStart && nowIST <= openWindowEnd;
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST <= closeWindowEnd;

      const openInputsFilled = game.patte1 || game.patte1_open;
      const closeInputsFilled = game.patte2_close || game.patte2;

      if ((insideOpenWindow && !openInputsFilled) || (insideCloseWindow && !closeInputsFilled)) {
        futureOpen.push(game);
      } else {
        allGames.push(game);
      }
    }

    res.json({ futureOpen, allGames });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};







exports.saveGameInput = async (req, res) => {
  try {
    const { id, patte1, patte1_open, patte2_close, patte2 } = req.body;
    if (!id) return res.status(400).json({ message: 'Game ID required' });

    const now = new Date();
    const inputDate = now.toISOString().split('T')[0]; // yyyy-mm-dd

    // Check if input exists for game & date
    const [existing] = await db.query(
      "SELECT id FROM game_inputs WHERE game_id = ? AND input_date = ?",
      [id, inputDate]
    );

    if (existing.length > 0) {
      // Update
      await db.query(
        `UPDATE game_inputs SET patte1 = ?, patte1_open = ?, patte2_close = ?, patte2 = ?, updated_at = NOW() WHERE id = ?`,
        [patte1, patte1_open, patte2_close, patte2, existing[0].id]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO game_inputs (game_id, input_date, patte1, patte1_open, patte2_close, patte2, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, inputDate, patte1, patte1_open, patte2_close, patte2]
      );
    }

    res.json({ success: true, message: 'Game inputs saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};








