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

exports.getGameById = async (req, res) => {
  try {
    const gameId = req.params.id;

    const [gameData] = await db.query(
      "SELECT id, game_name, open_time, close_time, days, prices FROM games WHERE id = ?",
      [gameId]
    );

    if (gameData.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Parse JSON strings to objects before sending
    const game = gameData[0];
    game.days = JSON.parse(game.days);
    game.prices = JSON.parse(game.prices);

    res.json({ success: true, game });
  } catch (err) {
    console.error("Get Game By ID error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateGameById = async (req, res) => {
  try {
    if (req.user.registerType !== "admin") {
      return res.status(403).json({ message: "Only admin can update games" });
    }

    const gameId = req.params.id;
    const { game_name, open_time, close_time, days, prices } = req.body;

    // Server-side validation
    if (!game_name || game_name.trim() === "") {
      return res.status(400).json({ message: "Game name is required" });
    }

    if (!open_time || open_time.trim() === "") {
      return res.status(400).json({ message: "Open time is required" });
    }

    if (!close_time || close_time.trim() === "") {
      return res.status(400).json({ message: "Close time is required" });
    }

    // Check if the game exists and belongs to admin
    const [existingGame] = await db.query(
      "SELECT * FROM games WHERE id = ? AND created_by = ?",
      [gameId, req.user.id]
    );

    if (existingGame.length === 0) {
      return res.status(404).json({ message: "Game not found or unauthorized" });
    }

    // Update query
    const sql = `
      UPDATE games
      SET game_name = ?, open_time = ?, close_time = ?, days = ?, prices = ?
      WHERE id = ? AND created_by = ?
    `;

    await db.query(sql, [
      game_name,
      open_time,
      close_time,
      JSON.stringify(days),
      JSON.stringify(prices),
      gameId,
      req.user.id
    ]);

    res.json({ success: true, message: "Game updated successfully" });
  } catch (err) {
    console.error("Update Game Error:", err);
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

//     // ✅ Get all games for admin
//     const [games] = await db.query(
//       `SELECT id, game_name, open_time, close_time, days 
//        FROM games WHERE created_by = ? ORDER BY id DESC`,
//       [req.user.id]
//     );

//     // ✅ Fetch inputs for today for all games
//     const gameIds = games.map(g => g.id);
//     let inputsMap = {};
//     if (gameIds.length > 0) {
//       const [inputs] = await db.query(
//         `SELECT * FROM game_inputs 
//          WHERE game_id IN (?) AND input_date = ?`,
//         [gameIds, todayIST]
//       );

//       inputs.forEach(input => {
//         inputsMap[input.game_id] = input;
//       });
//     }

//     const futureOpen = [];
//     const allGames = [];

//     games.forEach(game => {
//       // 👉 Add inputs if exists
//       const input = inputsMap[game.id] || {};
//       game.patte1 = input.patte1 || "";
//       game.patte1_open = input.patte1_open || "";
//       game.patte2_close = input.patte2_close || "";
//       game.patte2 = input.patte2 || "";

//       // 👉 Time calculations
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

// exports.getNearestGames = async (req, res) => {
//   try {
//     const now = new Date();
//     const offset = 5.5 * 60 * 60 * 1000; // IST offset
//     const nowIST = new Date(now.getTime() + offset);

//     const year = nowIST.getFullYear();
//     const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
//     const day = nowIST.getDate().toString().padStart(2, '0');
//     const todayIST = `${year}-${month}-${day}`;

//     // Yesterday date
//     const yesterdayIST = new Date(nowIST);
//     yesterdayIST.setDate(yesterdayIST.getDate() - 1);
//     const yYear = yesterdayIST.getFullYear();
//     const yMonth = (yesterdayIST.getMonth() + 1).toString().padStart(2, '0');
//     const yDay = yesterdayIST.getDate().toString().padStart(2, '0');
//     const yesterdayDate = `${yYear}-${yMonth}-${yDay}`;

//     // Get all games for admin
//     const [games] = await db.query(
//       `SELECT id, game_name, open_time, close_time, days, created_at
//        FROM games WHERE created_by = ? ORDER BY id DESC`,
//       [req.user.id]
//     );

//     // Fetch latest input per game for today or yesterday whichever is latest
//     const gameIds = games.map(g => g.id);
//     let inputsMap = {};
//     if (gameIds.length > 0) {
//       const [inputs] = await db.query(
//         `SELECT gi.*
//          FROM game_inputs gi
//          INNER JOIN (
//            SELECT game_id, MAX(input_date) AS latest_date
//            FROM game_inputs
//            WHERE game_id IN (?) AND (input_date = ? OR input_date = ?)
//            GROUP BY game_id
//          ) t
//          ON gi.game_id = t.game_id AND gi.input_date = t.latest_date`,
//         [gameIds, todayIST, yesterdayDate]
//       );

//       inputs.forEach(input => {
//         inputsMap[input.game_id] = input;
//       });
//     }

// // After fetching games and inputsMap ...

// const allGames = [];
// const futureGames = [];

// games.forEach(game => {
//   const input = inputsMap[game.id] || {};
// const formatDateToYMD = (date) => {
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = (d.getMonth() + 1).toString().padStart(2, '0');
//   const day = d.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// // Usage in your loop:
// const formattedInputDate = input.input_date ? formatDateToYMD(input.input_date) : null;
// const isNewDay = formattedInputDate !== todayIST;
// console.log('isNewDay: ', isNewDay);


//   let gameWithInputs = {
//     ...game,
//     patte1: input.patte1 || "",
//     patte1_open: input.patte1_open || "",
//     patte2_close: input.patte2_close || "",
//     patte2: input.patte2 || ""
//   };

//   const openDateTime = new Date(`${todayIST}T${game.open_time}`);
//   const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

//   const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
//   const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);

//   const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
//   const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;

//    if (isNewDay && (insideOpenWindow || insideCloseWindow)) {
//     // Naye din pehli baar open ya close window me dono inputs blank chahiye
//     futureGames.push({
//       ...gameWithInputs,
//       patte1: "",
//       patte1_open: "",
//       patte2_close: "",
//       patte2: ""
//     });
//   }

//   else if (insideOpenWindow && (!gameWithInputs.patte1 && !gameWithInputs.patte1_open)) {
//     // Jab open window hai AUR dono open inputs empty hain, tabhi futureGames me dikhao
//     futureGames.push({
//       ...gameWithInputs,
//       patte1: "",
//       patte1_open: ""
//     });
//   } else if (insideCloseWindow && (!gameWithInputs.patte2_close && !gameWithInputs.patte2)) {
//     // Jab close window hai AUR dono close inputs empty hain, tabhi futureGames me dikhao
//     futureGames.push({
//       ...gameWithInputs,
//       patte2_close: "",
//       patte2: ""
//     });
//   } else {
//     // Baaki sab cases me allGames me dikhado (yaani input ho gaya hai)
//     allGames.push(gameWithInputs);
//   }
// });


// // Send final response as before
// res.json({ futureGames, allGames });

//   } catch (err) {
//     console.error("getNearestGames error:", err);
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

    // Yesterday date
    const yesterdayIST = new Date(nowIST);
    yesterdayIST.setDate(yesterdayIST.getDate() - 1);
    const yYear = yesterdayIST.getFullYear();
    const yMonth = (yesterdayIST.getMonth() + 1).toString().padStart(2, '0');
    const yDay = yesterdayIST.getDate().toString().padStart(2, '0');
    const yesterdayDate = `${yYear}-${yMonth}-${yDay}`;

    // Get all games for admin
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days, created_at 
       FROM games WHERE created_by = ? 
       ORDER BY id DESC`,
      [req.user.id]
    );

    // Fetch latest input per game for today or yesterday whichever is latest
    const gameIds = games.map(g => g.id);
    let inputsMap = {};

    if (gameIds.length > 0) {
      const [inputs] = await db.query(
        `SELECT gi.* 
         FROM game_inputs gi
         INNER JOIN (
            SELECT game_id, MAX(input_date) AS latest_date 
            FROM game_inputs 
            WHERE game_id IN (?) AND (input_date = ? OR input_date = ?)
            GROUP BY game_id
         ) t 
         ON gi.game_id = t.game_id AND gi.input_date = t.latest_date`,
        [gameIds, todayIST, yesterdayDate]
      );

      inputs.forEach(input => {
        inputsMap[input.game_id] = input;
      });
    }

    // Set grace time duration in minutes
    const gracePeriodMinutes = 90;

    const allGames = [];
    const futureGames = [];

games.forEach(game => {
  const input = inputsMap[game.id] || {};

  let gameWithInputs = {
    ...game,
    patte1: input.patte1 || "",
    patte1_open: input.patte1_open || "",
    patte2_close: input.patte2_close || "",
    patte2: input.patte2 || ""
  };

  const openDateTime = new Date(`${todayIST}T${game.open_time}`);
  const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

  const hasAnyInput = !!(gameWithInputs.patte1 || gameWithInputs.patte1_open || gameWithInputs.patte2_close || gameWithInputs.patte2);

  if (!hasAnyInput) {
    const minutesToOpen = (openDateTime - nowIST) / 60000;
    const minutesToClose = (closeDateTime - nowIST) / 60000;

    const openWindowStarted = nowIST >= openDateTime;
    const closeWindowStarted = nowIST >= closeDateTime;

    // Add to futureGames only if:
    // 1️⃣ Window is about to start (<=30 min) OR
    // 2️⃣ Window already started but input missing
    if (minutesToOpen <= 30 || minutesToClose <= 30 || openWindowStarted || closeWindowStarted) {
      futureGames.push({ ...gameWithInputs, patte1: "", patte1_open: "", patte2_close: "", patte2: "" });
    }
  } else {
    allGames.push(gameWithInputs);
  }
});



    res.json({ futureGames, allGames });
  } catch (err) {
    console.error("getNearestGames error:", err);
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

exports.getPublicGames = async (req, res) => {
  try {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset
    const nowIST = new Date(now.getTime() + offset);

    const year = nowIST.getFullYear();
    const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
    const day = nowIST.getDate().toString().padStart(2, '0');
    const todayIST = `${year}-${month}-${day}`;

    // Yesterday date calculation
    const yesterdayIST = new Date(nowIST);
    yesterdayIST.setDate(yesterdayIST.getDate() - 1);
    const yYear = yesterdayIST.getFullYear();
    const yMonth = (yesterdayIST.getMonth() + 1).toString().padStart(2, '0');
    const yDay = yesterdayIST.getDate().toString().padStart(2, '0');
    const yesterdayDate = `${yYear}-${yMonth}-${yDay}`;

    // Get all active games
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days
       FROM games ORDER BY id ASC`
    );

    const gameIds = games.map(g => g.id);
    let inputsMap = {};
    if (gameIds.length > 0) {
      const [inputs] = await db.query(
        `SELECT gi.* FROM game_inputs gi
         INNER JOIN (
           SELECT game_id, MAX(input_date) AS latest_date
           FROM game_inputs
           WHERE game_id IN (?) AND (input_date = ? OR input_date = ?)
           GROUP BY game_id
         ) t ON gi.game_id = t.game_id AND gi.input_date = t.latest_date`,
        [gameIds, todayIST, yesterdayDate]
      );

      inputs.forEach(input => {
        inputsMap[input.game_id] = input;
      });
    }

    // Grace period
    const gracePeriodMinutes = 90;

   const resultGames = games.map(game => {
  const input = inputsMap[game.id] || {};
  const patte1 = input.patte1 || "";
  const patte1_open = input.patte1_open || "";
  const patte2_close = input.patte2_close || "";
  const patte2 = input.patte2 || "";

  const openDateTime = new Date(`${todayIST}T${game.open_time}`);
  const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

        // Input windows start 30 min before open/close time
      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);

        // Check if time is inside input window or inside grace period after open or close
      const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;

      const openWindowEndWithGrace = new Date(openDateTime.getTime() + gracePeriodMinutes * 60000);
      const closeWindowEndWithGrace = new Date(closeDateTime.getTime() + gracePeriodMinutes * 60000);

       const insideOpenGracePeriod = nowIST >= openDateTime && nowIST < openWindowEndWithGrace;
      const insideCloseGracePeriod = nowIST >= closeDateTime && nowIST < closeWindowEndWithGrace;

            const missingOpenInput = !patte1 && !patte1_open;
      const missingCloseInput = !patte2_close && !patte2;

  // New day check: compare input_date with todayIST
  const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedInputDate = input.input_date ? formatDateToYMD(input.input_date) : null;
  const isNewDay = formattedInputDate !== todayIST;  // True if input date is not today

  // Empty stars array
  let stars = Array(8).fill("★");

  // If new day, reset stars to empty values (e.g., use "-")
  if (isNewDay) {
    stars = Array(8).fill("★");
  } else {
    // Existing stars assignment using input values
    for (let i = 0; i < 3; i++) {
      if (patte1 && patte1.length > i) {
        stars[i] = patte1.charAt(i);
      }
    }
    if (patte1_open && patte1_open.length > 0) {
      stars[3] = patte1_open.charAt(0);
    }
    if (patte2_close && patte2_close.length > 0) {
      stars[4] = patte2_close.charAt(0);
    }
    for (let i = 0; i < 3; i++) {
      if (patte2 && patte2.length > i) {
        stars[5 + i] = patte2.charAt(i);
      }
    }
  }

  const starsWithDashes = [
    ...stars.slice(0, 3),
    '-',
    stars[3],
    stars[4],
    '-',
    ...stars.slice(5, 8),
  ];
 // Pending (future) games criteria: missing input AND in window or grace period or after window but input not filled yet
      const isPendingInput =
        (missingOpenInput && (insideOpenWindow || insideOpenGracePeriod || nowIST > openDateTime)) ||
        (missingCloseInput && (insideCloseWindow || insideCloseGracePeriod || nowIST > closeDateTime));
  // ... existing calculation for phase and isPendingInput unmodified ...


      let phase = 'waiting';
      if (nowIST >= openDateTime && nowIST < closeDateTime) {
        phase = 'open';
      } else if (nowIST >= closeDateTime) {
        phase = 'close';
      }

  return {
    id: game.id,
    game_name: game.game_name,
    starsWithDashes,
    open_time: game.open_time,
    close_time: game.close_time,
    phase,
    isPendingInput,
  };
});

const filteredGames = resultGames.filter(game => {
  // Parse today's date and open/close times
  const today = new Date();
  const offset = 5.5 * 60 * 60 * 1000; // IST offset (same as above)
  const nowIST = new Date(today.getTime() + offset);

  const openDateTime = new Date(`${todayIST}T${game.open_time}`);
  const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

  const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
  const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);

    // Define missing inputs from starsWithDashes:
  // If stars filled (not ★ or -) means input present
  const openInputFilled = game.starsWithDashes[0] !== "★" && game.starsWithDashes[1] !== "★" && game.starsWithDashes[2] !== "★" && game.starsWithDashes[3] !== "★";
  const closeInputFilled = game.starsWithDashes[4] !== "★" && game.starsWithDashes[5] !== "★" && game.starsWithDashes[6] !== "★" && game.starsWithDashes[7] !== "★";

  // Only include games where NOW is within open or close 30-min window
  const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
  const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;
  // Show only if in open window && input not filled OR close window && input not filled
  return (insideOpenWindow && !openInputFilled) || (insideCloseWindow && !closeInputFilled);
});

res.json({ games: filteredGames });



  } catch (err) {
    console.error("getPublicGames error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



function convertTo12HourFormat(time24) {
  let [hour, minute] = time24.split(':');
  hour = parseInt(hour, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // 0 ko 12 se replace karna
  return `${hour}:${minute} ${ampm}`;
}

exports.getPublicGameResults = async (req, res) => {
  try {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + offset);
    const year = nowIST.getFullYear();
    const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
    const day = nowIST.getDate().toString().padStart(2, '0');
    const todayIST = `${year}-${month}-${day}`;

    // Yesterday date
    const yesterdayIST = new Date(nowIST);
    yesterdayIST.setDate(yesterdayIST.getDate() - 1);
    const yYear = yesterdayIST.getFullYear();
    const yMonth = (yesterdayIST.getMonth() + 1).toString().padStart(2, '0');
    const yDay = yesterdayIST.getDate().toString().padStart(2, '0');
    const yesterdayDate = `${yYear}-${yMonth}-${yDay}`;

    const [games] = await db.query(`SELECT id, game_name, open_time, close_time FROM games ORDER BY id DESC`);

    const gameIds = games.map(g => g.id);
    let resultsMap = {};

    if (gameIds.length > 0) {
      const [results] = await db.query(
        `SELECT game_id, patte1, patte1_open, patte2_close, patte2, input_date
         FROM game_inputs
         WHERE game_id IN (?) AND (input_date = ? OR input_date = ?)`,
        [gameIds, todayIST, yesterdayDate]
      );

      results.forEach(r => {
        resultsMap[r.game_id] = `
        ${r.patte1 || ""}-${r.patte1_open || ""}${r.patte2_close || ""}-${r.patte2 || ""}`
          .replace(/(^-+|-+$)/g, '')
          .replace(/-+/g, '-')
          .replace(/-+$/, '');
      });
    }

    const gracePeriodMinutes = 30;

    const filteredGames = games.filter(g => {
      const openDateTime = new Date(`${todayIST}T${g.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${g.close_time}`);

      const openWindowStart = new Date(openDateTime.getTime() - gracePeriodMinutes * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - gracePeriodMinutes * 60000);

      const now = nowIST;

      // Check if current time is inside open or close 30-minute input window
      const isInOpenWindow = now >= openWindowStart && now < openDateTime;
      const isInCloseWindow = now >= closeWindowStart && now < closeDateTime;

      const input = resultsMap[g.id];

      // Include only those games NOT in any active input window AND have input (from today or yesterday)
      return !isInOpenWindow && !isInCloseWindow && input;
    });

    const data = filteredGames.map(g => ({
       id: g.id,
      game_name: g.game_name,
      result: resultsMap[g.id] || "",
      timing: `${convertTo12HourFormat(g.open_time.slice(0, 5))} - ${convertTo12HourFormat(g.close_time.slice(0, 5))}`
    }));

    res.json({ games: data });
  } catch (err) {
    console.error("getPublicGameResults error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getJodiRecords = async (req, res) => {
  const gameId = req.params.gameId;
  const { from, to } = req.query;

  // Date range helper
  function getDateRange(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      const y = currentDate.getFullYear();
      const m = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const d = currentDate.getDate().toString().padStart(2, '0');
      dateArray.push(`${y}-${m}-${d}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  // Format DB date to 'YYYY-MM-DD'
  function formatDate(dt) {
    const d = new Date(dt);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  try {
    const dates = getDateRange(from, to);

    // Get game name
    const [[gameRow]] = await db.query(
      `SELECT game_name FROM games WHERE id = ? LIMIT 1`,
      [gameId]
    );
    const game_name = gameRow ? gameRow.game_name : "";

    // Get input records
    const [rows] = await db.query(
      `SELECT input_date, patte1, patte1_open, patte2_close, patte2
       FROM game_inputs
       WHERE game_id = ? AND input_date BETWEEN ? AND ?
       ORDER BY input_date ASC`,
      [gameId, from, to]
    );

    // Map input_date to full record
    const inputMap = {};
    rows.forEach(row => {
      const key = formatDate(row.input_date);
      inputMap[key] = {
        patte1: row.patte1 || "",
        patte1_open: row.patte1_open || "",
        patte2_close: row.patte2_close || "",
        patte2: row.patte2 || "",
        jodi_value: (row.patte1_open || '') + (row.patte2_close || ''),
        result: `${row.patte1 || ""}-${row.patte1_open || ""}${row.patte2_close || ""}-${row.patte2 || ""}`
          .replace(/(^-+|-+$)/g, '')
          .replace(/-+/g, '-')
          .replace(/-+$/, "")
      };
    });

    // Find latest input for overall result string
    let latestInput = null;
    if (rows.length > 0) {
      latestInput = rows.reduce((a, b) => (new Date(a.input_date) > new Date(b.input_date) ? a : b));
    }

    const latestResultString = latestInput
      ? `${latestInput.patte1 || ""}-${latestInput.patte1_open || ""}${latestInput.patte2_close || ""}-${latestInput.patte2 || ""}`
          .replace(/(^-+|-+$)/g, '')
          .replace(/-+/g, '-')
          .replace(/-+$/, "")
      : "";

    // Prepare records array with "**" for missing dates
    const records = dates.map(date => {
      if (inputMap[date]) {
        return {
          input_date: date,
          jodi_value: inputMap[date].jodi_value,
        };
      } else {
        return {
          input_date: date,
          jodi_value: "**",
        };
      }
    });

    // Final response
    const response = {
      game_name,
      result: latestResultString,
      records
    };

    res.json(response);
  } catch (err) {
    console.error("getJodiRecords error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPanelRecords = async (req, res) => {
  const gameId = req.params.gameId;
  const { from, to } = req.query;

  // Date range helper
  function getDateRange(startDate, endDate) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      const y = currentDate.getFullYear();
      const m = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const d = currentDate.getDate().toString().padStart(2, '0');
      dateArray.push(`${y}-${m}-${d}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  // Format DB date to 'YYYY-MM-DD'
  function formatDate(dt) {
    const d = new Date(dt);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  try {
    const dates = getDateRange(from, to);

    // Get game name
    const [[gameRow]] = await db.query(
      `SELECT game_name FROM games WHERE id = ? LIMIT 1`,
      [gameId]
    );
    const game_name = gameRow ? gameRow.game_name : "";

    // Get input records
    const [rows] = await db.query(
      `SELECT input_date, patte1, patte1_open, patte2_close, patte2
       FROM game_inputs
       WHERE game_id = ? AND input_date BETWEEN ? AND ?
       ORDER BY input_date ASC`,
      [gameId, from, to]
    );

    // Map input_date to full record
    const inputMap = {};
    rows.forEach(row => {
      const key = formatDate(row.input_date);
      inputMap[key] = {
        panelLeft: row.patte1 ? row.patte1.split('') : ["*","*","*"],   // "123" -> ["1","2","3"]
        jodi: (row.patte1_open || "") + (row.patte2_close || ""),  
        panelRight: row.patte2 ? row.patte2.split('') : ["*","*","*"],  // "678" -> ["6","7","8"]
        // resultString: `${row.patte1 || ""}-${row.patte1_open || ""}${row.patte2_close || ""}-${row.patte2 || ""}`
        //   .replace(/(^-+|-+$)/g, '')
        //   .replace(/-+/g, '-')
        //   .replace(/-+$/, "")
      };
    });


    // Find latest input for overall result string
    let latestInput = null;
    if (rows.length > 0) {
      latestInput = rows.reduce((a, b) => (new Date(a.input_date) > new Date(b.input_date) ? a : b));
    }

    const latestResultString = latestInput
      ? `${latestInput.patte1 || ""}-${latestInput.patte1_open || ""}${latestInput.patte2_close || ""}-${latestInput.patte2 || ""}`
          .replace(/(^-+|-+$)/g, '')
          .replace(/-+/g, '-')
          .replace(/-+$/, "")
      : "";

    // Prepare records array with "**" for missing dates
    const records = dates.map(date => {
      if (inputMap[date]) {
        return {
          input_date: date,
          panelLeft: inputMap[date].panelLeft,
          jodi: inputMap[date].jodi,
          panelRight: inputMap[date].panelRight,
          resultString: inputMap[date].resultString
        };
      } else {
        return {
          input_date: date,
          panelLeft: ["*","*","*"],
          jodi: "**",
          panelRight: ["*","*","*"],
          resultString: "**"
        };
      }
    });

    // Final response
    const response = {
      game_name,
      latestResultString,
      records
    };

    res.json(response);
  } catch (err) {
    console.error("getPanelRecords error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



















