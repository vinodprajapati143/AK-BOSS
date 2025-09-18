const db = require("../config/db");

exports.addGame = async (req, res) => {
  try {
    if (req.user.registerType !== "admin") {
      return res.status(403).json({ message: "Only admin can add games" });
    }

    let { game_name, open_time, close_time, days, prices } = req.body;

    // Trim inputs
    game_name = (game_name || "").trim();
    open_time = (open_time || "").trim();
    close_time = (close_time || "").trim();

    // Validate required fields
    if (!game_name) return res.status(400).json({ message: "Game name is required" });
    if (!open_time) return res.status(400).json({ message: "Open time is required" });
    if (!close_time) return res.status(400).json({ message: "Close time is required" });

    // Time format regex: HH:mm or HH:mm:ss
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    if (!timeRegex.test(open_time)) return res.status(400).json({ message: "Open time format is invalid" });
    if (!timeRegex.test(close_time)) return res.status(400).json({ message: "Close time format is invalid" });

    // Validate days (must be array of valid weekday strings)
    const allowedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (!Array.isArray(days) || !days.every(d => allowedDays.includes(d))) {
      return res.status(400).json({ message: "Days must be an array of valid weekdays" });
    }

    // Validate prices (must be an object with numeric values)
    if (typeof prices !== 'object' || prices === null || Object.values(prices).some(v => typeof v !== "number")) {
      return res.status(400).json({ message: "Prices must be an object with numeric values" });
    }

    // Check if close_time is next day (midnight crossover)
    const openTimeParts = open_time.split(':').map(Number);
    const closeTimeParts = close_time.split(':').map(Number);

    const openTotalMinutes = openTimeParts[0] * 60 + openTimeParts[1];
    const closeTotalMinutes = closeTimeParts[0] * 60 + closeTimeParts[1];

    const isNextDayClose = closeTotalMinutes <= openTotalMinutes;

    // Get admin phone
    const [admin] = await db.query("SELECT phone FROM users WHERE id = ?", [req.user.id]);
    if (!admin.length) return res.status(400).json({ message: "Admin user not found" });

    // Insert into database
    const sql = `
      INSERT INTO games (game_name, open_time, close_time, days, prices, created_by, created_by_phone, is_next_day_close)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      game_name,
      open_time,
      close_time,
      JSON.stringify(days),
      JSON.stringify(prices),
      req.user.id,
      admin[0].phone,
      isNextDayClose
    ]);

    res.json({ success: true, message: "Game added successfully", gameId: result.insertId });

  } catch (err) {
    console.error("Add Game Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.getGameById = async (req, res) => {
  try {
    const gameId = Number(req.params.id);
    if (isNaN(gameId)) {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    const [gameData] = await db.query(
      "SELECT id, game_name, open_time, close_time, days, prices FROM games WHERE id = ?",
      [gameId]
    );

    if (gameData.length === 0) {
      return res.status(404).json({ message: "Game not found" });
    }

    const game = gameData[0];
    try {
      game.days = JSON.parse(game.days);
    } catch {
      game.days = [];
    }
    try {
      game.prices = JSON.parse(game.prices);
    } catch {
      game.prices = {};
    }

    res.json({ success: true, game });

  } catch (err) {
    console.error("Get Game By ID error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateGameById = async (req, res) => {
  try {
    // Example time regex, days validation like in addGame
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;
    const allowedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (req.user.registerType !== "admin") {
      return res.status(403).json({ message: "Only admin can update games" });
    }

    const gameId = Number(req.params.id);
    if (!gameId) return res.status(400).json({ message: "Invalid game id" });

    let { game_name, open_time, close_time, days, prices } = req.body;

    game_name = (game_name || "").trim();
    open_time = (open_time || "").trim();
    close_time = (close_time || "").trim();

    if (!game_name) return res.status(400).json({ message: "Game name is required" });
    if (!timeRegex.test(open_time)) return res.status(400).json({ message: "Open time is invalid" });
    if (!timeRegex.test(close_time)) return res.status(400).json({ message: "Close time is invalid" });
    if (!Array.isArray(days) || !days.every(d => allowedDays.includes(d))) {
      return res.status(400).json({ message: "Days must be valid weekdays" });
    }
    if (typeof prices !== 'object' || prices === null || Object.values(prices).some(v => typeof v !== 'number')) {
      return res.status(400).json({ message: "Prices must be object with numeric values" });
    }

    // After trimming and time format validations

      // Calculate if close_time is next day
      const openTimeParts = open_time.split(':').map(Number);
      const closeTimeParts = close_time.split(':').map(Number);

      const openTotalMinutes = openTimeParts[0] * 60 + openTimeParts[1];
      const closeTotalMinutes = closeTimeParts[0] * 60 + closeTimeParts[1];

      const isNextDayClose = closeTotalMinutes <= openTotalMinutes;


    const [existingGame] = await db.query("SELECT * FROM games WHERE id = ? AND created_by = ?", [gameId, req.user.id]);
    if (!existingGame.length) {
      return res.status(404).json({ message: "Game not found or unauthorized" });
    }

    const sql = `
      UPDATE games
      SET game_name = ?, open_time = ?, close_time = ?, days = ?, prices = ?, is_next_day_close = ?
      WHERE id = ? AND created_by = ?
    `;

    await db.query(sql, [
      game_name,
      open_time,
      close_time,
      JSON.stringify(days),
      JSON.stringify(prices),
      isNextDayClose,
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
      `SELECT id, game_name, open_time, close_time, is_next_day_close
      FROM games
      WHERE created_by = ?
      ORDER BY id DESC`,
      [req.user.id]
    );
    // Convert 1/0 to true/false
    const gamesWithBoolFlag = games.map(game => ({
      ...game,
      is_next_day_close: Boolean(game.is_next_day_close),
    }));

    res.json({ success: true, data: gamesWithBoolFlag });
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


// secod bext up to mark still working to achive best
exports.getNearestGames = async (req, res) => {
  try {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset
    const nowIST = new Date(now.getTime() + offset);

    const year = nowIST.getFullYear();
    const month = (nowIST.getMonth() + 1).toString().padStart(2, '0');
    const day = nowIST.getDate().toString().padStart(2, '0');
    const todayIST = `${year}-${month}-${day}`;
    console.log('todayIST: ', todayIST);

    // Yesterday date
    const yesterdayIST = new Date(nowIST);
    yesterdayIST.setDate(yesterdayIST.getDate() - 1);
    const yYear = yesterdayIST.getFullYear();
    const yMonth = (yesterdayIST.getMonth() + 1).toString().padStart(2, '0');
    const yDay = yesterdayIST.getDate().toString().padStart(2, '0');
    const yesterdayDate = `${yYear}-${yMonth}-${yDay}`;
    console.log('yesterdayDate: ', yesterdayDate);

    const todayName = nowIST.toLocaleDateString('en-US', { weekday: 'long' }); 
    console.log('todayName: ', todayName);

    // Get all games for admin
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days, created_at
       FROM games WHERE created_by = ? ORDER BY id DESC`,
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
          WHERE game_id IN (?)
          GROUP BY game_id
        ) t 
        ON gi.game_id = t.game_id AND gi.input_date = t.latest_date`,
        [gameIds]
      );

      inputs.forEach(input => {
        inputsMap[input.game_id] = input;
      });
    }

    // Set grace time duration in minutes (change as needed)
    const gracePeriodMinutes = 90;

    const allGames = [];
    const futureGames = [];

    games.forEach(game => {
      const input = inputsMap[game.id] || {};
      console.log('input: ', input);

      const formatDateToYMD = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedInputDate = input.input_date ? formatDateToYMD(input.input_date) : null;
      console.log('formattedInputDate: ', formattedInputDate);

      const yesterdayDate = (() => {
        const d = new Date(todayIST);
        d.setDate(d.getDate() - 1);
        return formatDateToYMD(d);
      })();
      let isNewDay = formattedInputDate !== todayIST;
       

      let gameWithInputs = {
        ...game,
        patte1: input.patte1 || "",
        patte1_open: input.patte1_open || "",
        patte2_close: input.patte2_close || "",
        patte2: input.patte2 || "",
        days: JSON.parse(game.days || '[]'),

      };

      const gameDays = gameWithInputs.days;

          // 🔥 FILTERING LOGIC (holiday / off-day)
      if (gameDays.length === 0) {
        // holiday case
       console.log("holiday case",gameWithInputs.id)

        allGames.push(gameWithInputs);
        return;
      }
      if (!gameDays.includes(todayName)) {
       console.log("aaj ka din is game ka nahi hai",gameWithInputs.id)

        // aaj ka din is game ka nahi hai
        allGames.push(gameWithInputs);
        return;
      }

      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      console.log('openDateTime: ', openDateTime);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);
      console.log('closeDateTime: ', closeDateTime);

      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      console.log('openWindowStart: ', openWindowStart);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);
      console.log('closeWindowStart: ', closeWindowStart);

      const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
      console.log('insideOpenWindow: ', insideOpenWindow);
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;
      console.log('insideCloseWindow: ', insideCloseWindow);

      // Grace period end times
      const openWindowEndWithGrace = new Date(openDateTime.getTime() + gracePeriodMinutes * 60000);
      console.log('openWindowEndWithGrace: ', openWindowEndWithGrace);
      const closeWindowEndWithGrace = new Date(closeDateTime.getTime() + gracePeriodMinutes * 60000);
      console.log('closeWindowEndWithGrace: ', closeWindowEndWithGrace);

      // Check if still in grace period after close time
      const insideOpenGracePeriod = nowIST >= openDateTime && nowIST < openWindowEndWithGrace;
      console.log('insideOpenGracePeriod: ', insideOpenGracePeriod);
      const insideCloseGracePeriod = nowIST >= closeDateTime && nowIST < closeWindowEndWithGrace;
      console.log('insideCloseGracePeriod: ', insideCloseGracePeriod);

      const missingOpenInput = !gameWithInputs.patte1 && !gameWithInputs.patte1_open;
      console.log('missingOpenInput: ', missingOpenInput);
      const missingCloseInput = !gameWithInputs.patte2_close && !gameWithInputs.patte2;
      console.log('missingCloseInput: ', missingCloseInput);

      const openWindowStarted = nowIST >= openWindowStart && nowIST < openDateTime;
      console.log('openWindowStarted: ', openWindowStarted);
      const closeWindowStarted = nowIST >= closeWindowStart && nowIST < closeDateTime;
      console.log('closeWindowStarted: ', closeWindowStarted);

 if (
  formattedInputDate === yesterdayDate &&
  !missingOpenInput &&
  missingCloseInput
) {
  isNewDay =false
}


   if (isNewDay && (insideOpenWindow || insideCloseWindow || insideOpenGracePeriod || insideCloseGracePeriod)) {
  // NEW DAY, input nhi hai, value blank hi dikhao (only then!)
  futureGames.push({
    ...gameWithInputs,
    patte1: "",
    patte1_open: "",
    patte2_close: "",
    patte2: "",
    formattedInputDate:formattedInputDate
  });
  console.log("NEW DAY, input nhi hai, value blank hi dikhao (only then!)");
}
else if (openWindowStarted && missingOpenInput) {
  // Sirf open input missing hai, to sirf open wale blank
  futureGames.push({
    ...gameWithInputs,
    patte1: "",
    patte1_open: "",
    formattedInputDate:formattedInputDate
   
  });
  console.log(" // Sirf open input missing hai, to sirf open wale blank")
} else if (closeWindowStarted && missingCloseInput) {
  // Sirf close input missing hai, to sirf close wale blank
  futureGames.push({
    ...gameWithInputs,
    patte2_close: "",
    patte2: "",
    formattedInputDate:formattedInputDate


  });
  console.log("Sirf close input missing hai, to sirf close wale blank")

} else if (missingOpenInput && nowIST > openDateTime) {
  // open window khatam, still missing, to bhi sirf open blank karo
  futureGames.push({
    ...gameWithInputs,
    patte1: "",
    patte1_open: "",
    formattedInputDate:formattedInputDate


  });
  console.log("open window khatam, still missing, to bhi sirf open blank karo")

} else if (missingCloseInput && nowIST > closeDateTime) {
  // close window khatam, still missing, to bhi sirf close blank karo
  futureGames.push({
    ...gameWithInputs,
    patte2_close: "",
    patte2: "",
    formattedInputDate:formattedInputDate

  });
  console.log("close window khatam, still missing, to bhi sirf close blank karo")

}
// 🔹 Special Case: Input yesterday ka hai, open mila hai, close missing hai, aur day change ho gaya
else if (
  formattedInputDate === yesterdayDate &&
  !missingOpenInput &&
  missingCloseInput
) {
  futureGames.push({
    ...gameWithInputs,
    patte2_close: "",
    patte2: "",
    formattedInputDate:formattedInputDate

  });
  console.log("Special Case: Input yesterday ka hai, open mila hai, close missing hai, aur day change ho gaya")
}

else {
  console.log("all Games")

  allGames.push(gameWithInputs);
}

    });

    // Send final response as before
   

      return res.json({
            success: true,
            data: {
                comingSoonGames:futureGames,
                allGames
            }
        });
 
    // res.json({ futureGames, allGames });

  } catch (err) {
    console.error("getNearestGames error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// working code ends

 
 







 


exports.saveGameInput = async (req, res) => {
  try {
    const { id, patte1, patte1_open, patte2_close, patte2, input_date } = req.body;
    if (!id) return res.status(400).json({ message: 'Game ID required' });

    // Agar client se inputDate mila hai to wahi use karo, warna aaj ki date
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    const finalInputDate = input_date || todayDate;
    console.log('finalInputDate: ', finalInputDate);

    // Check if input exists for game & date
    const [existing] = await db.query(
      "SELECT id FROM game_inputs WHERE game_id = ? AND input_date = ?",
      [id, finalInputDate]
    );

    console.log('existing: ', existing);
    if (existing.length > 0) {
      // Update
      await db.query(
        `UPDATE game_inputs 
         SET patte1 = ?, patte1_open = ?, patte2_close = ?, patte2 = ?, updated_at = NOW() 
         WHERE id = ?`,
        [patte1, patte1_open, patte2_close, patte2, existing[0].id]
      );
    } else {
      // Insert
      await db.query(
        `INSERT INTO game_inputs 
         (game_id, input_date, patte1, patte1_open, patte2_close, patte2, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [id, finalInputDate, patte1, patte1_open, patte2_close, patte2]
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

    const todayName = nowIST.toLocaleDateString('en-US', { weekday: 'long' }); 


    // Get all active games
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days
       FROM games ORDER BY id ASC`
    );

    const gameIds = games.map(g => g.id);
    let inputsMap = {};
      let resultsMap = {};

    if (gameIds.length > 0) {
        const [inputs] = await db.query(
        `SELECT gi.* 
        FROM game_inputs gi
        INNER JOIN (
          SELECT game_id, MAX(input_date) AS latest_date
          FROM game_inputs
          WHERE game_id IN (?)
          GROUP BY game_id
        ) t 
        ON gi.game_id = t.game_id AND gi.input_date = t.latest_date`,
        [gameIds]
      );

      inputs.forEach(input => {
        inputsMap[input.game_id] = input;
      });

      if (inputs.length > 0) {
        inputs.forEach(r => {
         resultsMap[r.game_id] = (
          (r.patte1 || "") + "-" +
          (r.patte1_open || "") + (r.patte2_close || "") + "-" +
          (r.patte2 || "")
        )
          .replace(/(^-+|-+$)/g, '')
          .replace(/-+/g, '-')
          .replace(/-+$/, '')
          .trim();
        });
      }
    }

    // Grace period
    const gracePeriodMinutes = 90;

    const allGames = [];
    const futureGames = [];

    games.forEach(game => {
      const input = inputsMap[game.id] || {};

      const formatDateToYMD = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedInputDate = input.input_date ? formatDateToYMD(input.input_date) : null;

      let gameWithInputs = {
        ...game,
        patte1: input.patte1 || "",
        patte1_open: input.patte1_open || "",
        patte2_close: input.patte2_close || "",
        patte2: input.patte2 || "",
        days: JSON.parse(game.days || '[]'),
        formattedInputDate
      };



      

      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);
      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);

      const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;

      const openWindowEndWithGrace = new Date(openDateTime.getTime() + gracePeriodMinutes * 60000);
      const closeWindowEndWithGrace = new Date(closeDateTime.getTime() + gracePeriodMinutes * 60000);
      const insideOpenGracePeriod = nowIST >= openDateTime && nowIST < openWindowEndWithGrace;
      const insideCloseGracePeriod = nowIST >= closeDateTime && nowIST < closeWindowEndWithGrace;

      const missingOpenInput = !gameWithInputs.patte1 && !gameWithInputs.patte1_open;
      const missingCloseInput = !gameWithInputs.patte2_close && !gameWithInputs.patte2;

      // ⭐ Stars Logic
      let stars = Array(8).fill("★");

      let isNewDay = formattedInputDate !== todayIST;
       if (
          formattedInputDate === yesterdayDate &&
          !missingOpenInput &&
          missingCloseInput
        ) {
          isNewDay =false
        }
      if (!isNewDay) {
        for (let i = 0; i < 3; i++) {
          if (gameWithInputs.patte1 && gameWithInputs.patte1.length > i) {
            stars[i] = gameWithInputs.patte1.charAt(i);
          }
        }
        if (gameWithInputs.patte1_open) {
          stars[3] = gameWithInputs.patte1_open.charAt(0);
        }
        if (gameWithInputs.patte2_close) {
          stars[4] = gameWithInputs.patte2_close.charAt(0);
        }
        for (let i = 0; i < 3; i++) {
          if (gameWithInputs.patte2 && gameWithInputs.patte2.length > i) {
            stars[5 + i] = gameWithInputs.patte2.charAt(i);
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

      const result = resultsMap[game.id] || "";
      const timing = `${convertTo12HourFormat(game.open_time.slice(0, 5))} - ${convertTo12HourFormat(game.close_time.slice(0, 5))}`;

                  const gameDays = gameWithInputs.days;

          // 🔥 FILTERING LOGIC (holiday / off-day)
      if (gameDays.length === 0) {
        // holiday case
       console.log("holiday case",gameWithInputs.id)

        allGames.push({
        ...gameWithInputs, starsWithDashes ,result, timing
        });
        return;
      }
      if (!gameDays.includes(todayName)) {
       console.log("aaj ka din is game ka nahi hai",gameWithInputs.id)

        // aaj ka din is game ka nahi hai
        allGames.push({...gameWithInputs, starsWithDashes ,result, timing});
        return;
      }

      // 🔹 Coming soon logic
      if (isNewDay && (insideOpenWindow || insideCloseWindow || insideOpenGracePeriod || insideCloseGracePeriod)) {
        futureGames.push({ ...gameWithInputs, starsWithDashes, patte1: "", patte1_open: "", patte2_close: "", patte2: "" });
      } else if (insideOpenWindow && missingOpenInput) {
        futureGames.push({ ...gameWithInputs, starsWithDashes, patte1: "", patte1_open: "" });
      } else if (insideCloseWindow && missingCloseInput) {
        futureGames.push({ ...gameWithInputs, starsWithDashes, patte2_close: "", patte2: "" });
      } else if (missingOpenInput && nowIST > openDateTime) {
        futureGames.push({ ...gameWithInputs, starsWithDashes, patte1: "", patte1_open: "" });
      } else if (missingCloseInput && nowIST > closeDateTime) {
        futureGames.push({ ...gameWithInputs, starsWithDashes, patte2_close: "", patte2: "" });
      }
      else if (
      formattedInputDate === yesterdayDate &&
      !missingOpenInput &&
      missingCloseInput
    ) {
      futureGames.push({
        ...gameWithInputs,
        patte2_close: "",
        patte2: "",
        starsWithDashes,

      });
      console.log("Special Case: Input yesterday ka hai, open mila hai, close missing hai, aur day change ho gaya")
    }
      
      else {
        allGames.push({ ...gameWithInputs, starsWithDashes ,result, timing});
      }
    });

    res.json({
      success: true,
      data: {
        comingSoonGames: futureGames,
        allGames
      }
    });

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
      days: JSON.parse(g.days || '[]'),
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

exports.getUserBoardGames = async (req, res) => {
  try {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST offset
    const nowIST = new Date(now.getTime() + offset);

    const todayIST = nowIST.toISOString().split('T')[0];
    const todayName = nowIST.toLocaleDateString("en-US", { weekday: "long" });

    const yesterdayIST = new Date(nowIST);
    yesterdayIST.setDate(yesterdayIST.getDate() - 1);
    const yesterdayDate = yesterdayIST.toISOString().split('T')[0];

    // Fetch all active games
    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time, days
       FROM games ORDER BY id ASC`
    );

    const gameIds = games.map(g => g.id);
    let inputsMap = {};

    if (gameIds.length > 0) {
      const [inputs] = await db.query(
        `SELECT gi.* 
         FROM game_inputs gi
         INNER JOIN (
           SELECT game_id, MAX(input_date) AS latest_date
           FROM game_inputs
           WHERE game_id IN (?)
           GROUP BY game_id
         ) t 
         ON gi.game_id = t.game_id AND gi.input_date = t.latest_date`,
        [gameIds]
      );

      inputs.forEach(input => {
        inputsMap[input.game_id] = input;
      });
    }

    const gracePeriodMinutes = 90;
    const responseData = [];

    games.forEach(game => {
      const input = inputsMap[game.id] || {};
      const gameDays = JSON.parse(game.days || "[]");

      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);

      const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;

      const openWindowEndWithGrace = new Date(openDateTime.getTime() + gracePeriodMinutes * 60000);
      const closeWindowEndWithGrace = new Date(closeDateTime.getTime() + gracePeriodMinutes * 60000);

      const insideOpenGracePeriod = nowIST >= openDateTime && nowIST < openWindowEndWithGrace;
      const insideCloseGracePeriod = nowIST >= closeDateTime && nowIST < closeWindowEndWithGrace;

      const missingOpenInput = !input.patte1 && !input.patte1_open;
      const missingCloseInput = !input.patte2_close && !input.patte2;

      const openWindowStarted = nowIST >= openWindowStart && nowIST < openDateTime;
      const closeWindowStarted = nowIST >= closeWindowStart && nowIST < closeDateTime;

      const formattedInputDate = input.input_date
        ? new Date(input.input_date).toISOString().split('T')[0]
        : null;

      let isNewDay = formattedInputDate !== todayIST;
      console.log('isNewDay: ', isNewDay);

      let status = "Play";

      let result = [
      input.patte1 || "XXX",
      (input.patte1_open || "X") + (input.patte2_close || "X"),
      input.patte2 || "XXX"
    ].join("-");

      // 🔹 Holiday / off-day
      if (gameDays.length === 0 || !gameDays.includes(todayName)) {
        status = "Holiday";
      }
      // 🔹 Special yesterday case
      else if (formattedInputDate === yesterdayDate && !missingOpenInput && missingCloseInput) {
        isNewDay = false;
        console.log(isNewDay);
      }

      // 🔹 Determine Play / Close

        
      if (
        isNewDay
      ) {
        status = "Play";
        result = ["XXX", "XX", "XXX"].join("-");
      }

        else if ( 
       ( !missingOpenInput &&
        !missingCloseInput)
      ) {
        status = "Close";
      result = [
      input.patte1 || "XXX",
      (input.patte1_open || "X") + (input.patte2_close || "X"),
      input.patte2 || "XXX"].join("-");
      }
      
      // else if (
      //   isNewDay &&
      //   (insideOpenWindow || insideCloseWindow || insideOpenGracePeriod || insideCloseGracePeriod)
      // ) {
      //   status = "close";
      //   result = ["XXX", "XX", "XXX"].join("-");
      // }
       else if (openWindowStarted) {
        status = "Close";
        // result = ["XXX", "X" + (input.patte2_close || "X"), input.patte2 || "XXX"].join("-");
      }
       else if (closeWindowStarted) {
        status = "Close";
        // result = [input.patte1 || "XXX", (input.patte1_open || "X") + "X", "XXX"].join("-");
      }
      //  else if (missingOpenInput && nowIST > openDateTime) {
      //   status = "close";
      //   result = ["XXX", "X" + (input.patte2_close || "X"), input.patte2 || "XXX"].join("-");

      // } else if (missingCloseInput && nowIST > closeDateTime) {
      //   status = "close";
      //   result = [input.patte1 || "XXX", (input.patte1_open || "X") + "X", "XXX"].join("-");

      // } else if (formattedInputDate === yesterdayDate && !missingOpenInput && missingCloseInput) {
      //   status = "close";
      //   result = [input.patte1 || "XXX", (input.patte1_open || "X") + "X", "XXX"].join("-");

      // }
       else {
        status = "Play";
      }

   

      responseData.push({
        id: game.id,
        name: game.game_name,
        date: todayIST,
        day: todayName,
        open_time: convertTo12HourFormat(game.open_time.slice(0, 5)),
        close_time: convertTo12HourFormat(game.close_time.slice(0, 5)),
        result,
        status,
        formattedInputDate,
     
      });
    });

    res.json({
      success: true,
      data: responseData,
    });
  } catch (err) {
    console.error("getUserBoardGames error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





 






















