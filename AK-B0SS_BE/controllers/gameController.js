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

    // आज और कल दोनों की तारीख़
    const year = nowIST.getFullYear();
    const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
    const day = nowIST.getDate().toString().padStart(2, '0');
    const todayIST = `${year}-${month}-${day}`;

    const yesterdayISTobj = new Date(nowIST.getTime() - 24 * 60 * 60 * 1000);
    const yYear = yesterdayISTobj.getFullYear();
    const yMonth = (yesterdayISTobj.getMonth() + 1).toString().padStart(2, '0');
    const yDay = yesterdayISTobj.getDate().toString().padStart(2, '0');
    const yesterdayIST = `${yYear}-${yMonth}-${yDay}`;

    // Admin के सारे games निकालें
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days FROM games WHERE created_by = ? ORDER BY id DESC`,
      [req.user.id]
    );

    const gameIds = games.map(g => g.id);
    let inputsMap = {};

    if (gameIds.length > 0) {
      // आज और कल दोनों दिनों के inputs fetch करें
      const placeholders = gameIds.map(() => '?').join(',');
      const query = `
        SELECT * FROM game_inputs
        WHERE game_id IN (${placeholders})
          AND (input_date = ? OR input_date = ?)
        ORDER BY input_date DESC, created_at DESC
      `;
      const [inputs] = await db.query(query, [...gameIds, todayIST, yesterdayIST]);

      // हर गेम के लिए latest input map करें
      inputs.forEach(input => {
        if (!inputsMap[input.game_id]) {
          inputsMap[input.game_id] = input;
        }
      });
    }

    const futureOpen = [];
    const allGames = [];

    games.forEach(game => {
      const input = inputsMap[game.id] || {};

      const gameStartTime = new Date(`${todayIST}T${game.open_time}`);
      const diffMs = gameStartTime - nowIST; // गेम शुरू होने तक बचा समय (ms में)

      // टाइम thresholds
      const showInputDuration = 22 * 60 * 60 * 1000; // पुराने input को दिखाने का समय (22 घंटे)
      const placeholderDuration = 1.5 * 60 * 60 * 1000; // placeholder दिखाने का समय (1.5 घंटे)
      const futureOpenDuration = 30 * 60 * 1000; // future input के लिए 30 मिनट

      // पुराना ±30 मिनट वाला open/close window
      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      const openWindowEnd = new Date(openDateTime.getTime() + 60 * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);
      const closeWindowEnd = new Date(closeDateTime.getTime() + 60 * 60000);

      const insideOpenWindow = nowIST >= openWindowStart && nowIST <= openWindowEnd;
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST <= closeWindowEnd;

      const openInputsFilled = input.patte1 || input.patte1_open;
      const closeInputsFilled = input.patte2_close || input.patte2;

      // लॉजिक: input दिखाने की स्थिति
      if (diffMs > showInputDuration) {
        // पुराने इनपुट 22 घंटे तक वैसे ही दिखाएं
        game.patte1 = input.patte1 || '';
        game.patte1_open = input.patte1_open || '';
        game.patte2_close = input.patte2_close || '';
        game.patte2 = input.patte2 || '';
        allGames.push(game);
      } else if (diffMs <= showInputDuration && diffMs > (showInputDuration - placeholderDuration)) {
        // 2pm से 3:30pm तक placeholder *** दिखाएं
        game.patte1 = '***';
        game.patte1_open = '***';
        game.patte2_close = '***';
        game.patte2 = '***';
        allGames.push(game);
      } else if (diffMs <= (showInputDuration - placeholderDuration) && diffMs > futureOpenDuration) {
        // अंतिम 30 मिनटों में future open के लिए खाली इनपुट कलियर करें
        game.patte1 = '';
        game.patte1_open = '';
        game.patte2_close = '';
        game.patte2 = '';
        futureOpen.push(game);
      } else {
        // बाकी समय (गेम शुरू होने के बाद) old ±30 min logic लागू करें
        game.patte1 = input.patte1 || '';
        game.patte1_open = input.patte1_open || '';
        game.patte2_close = input.patte2_close || '';
        game.patte2 = input.patte2 || '';

        if ((insideOpenWindow && !openInputsFilled) || (insideCloseWindow && !closeInputsFilled)) {
          futureOpen.push(game);
        } else {
          allGames.push(game);
        }
      }
    });

    res.json({ futureOpen, allGames });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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








