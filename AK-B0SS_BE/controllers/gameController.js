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

    // Set grace time duration in minutes (change as needed)
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
      const isNewDay = formattedInputDate !== todayIST;

      let gameWithInputs = {
        ...game,
        patte1: input.patte1 || "",
        patte1_open: input.patte1_open || "",
        patte2_close: input.patte2_close || "",
        patte2: input.patte2 || ""
      };

      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

      const openWindowStart = new Date(openDateTime.getTime() - 30 * 60000);
      const closeWindowStart = new Date(closeDateTime.getTime() - 30 * 60000);

      const insideOpenWindow = nowIST >= openWindowStart && nowIST < openDateTime;
      const insideCloseWindow = nowIST >= closeWindowStart && nowIST < closeDateTime;

      // Grace period end times
      const openWindowEndWithGrace = new Date(openDateTime.getTime() + gracePeriodMinutes * 60000);
      const closeWindowEndWithGrace = new Date(closeDateTime.getTime() + gracePeriodMinutes * 60000);

      // Check if still in grace period after close time
      const insideOpenGracePeriod = nowIST >= openDateTime && nowIST < openWindowEndWithGrace;
      const insideCloseGracePeriod = nowIST >= closeDateTime && nowIST < closeWindowEndWithGrace;

      const missingOpenInput = !gameWithInputs.patte1 && !gameWithInputs.patte1_open;
      const missingCloseInput = !gameWithInputs.patte2_close && !gameWithInputs.patte2;

      const openWindowStarted = nowIST >= openWindowStart && nowIST < openDateTime;
      const closeWindowStarted = nowIST >= closeWindowStart && nowIST < closeDateTime;

      if (isNewDay && (insideOpenWindow || insideCloseWindow)) {
        // New day first input window
        futureGames.push({
          ...gameWithInputs,
          patte1: "",
          patte1_open: "",
          patte2_close: "",
          patte2: ""
        });
      }
      else if (openWindowStarted && missingOpenInput) {
      futureGames.push(gameWithInputs);
    } else if (closeWindowStarted && missingCloseInput) {
      futureGames.push(gameWithInputs);
    } else if (missingOpenInput && openWindowStarted) {
      futureGames.push(gameWithInputs);
    } else if (missingCloseInput && closeWindowStarted) {
      futureGames.push(gameWithInputs);
    } else if (missingOpenInput && nowIST > openDateTime) {
      // open window gone but input missing: still futureGames
      futureGames.push(gameWithInputs);
    } else if (missingCloseInput && nowIST > closeDateTime) {
      // close window gone but input missing: still futureGames
      futureGames.push(gameWithInputs);
    } else {
      allGames.push(gameWithInputs);
    }
    });

    // Send final response as before
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

    const resultGames = games.map(game => {
      const input = inputsMap[game.id] || {};
      const patte1 = input.patte1 || "";
      const patte1_open = input.patte1_open || "";
      const patte2_close = input.patte2_close || "";
      const patte2 = input.patte2 || "";

      // Calculate phases based on open and close time and current time
      const openDateTime = new Date(`${todayIST}T${game.open_time}`);
      const closeDateTime = new Date(`${todayIST}T${game.close_time}`);

      let phase = 'waiting';
      if (nowIST >= openDateTime && nowIST < closeDateTime) {
        phase = 'open';
      } else if (nowIST >= closeDateTime) {
        phase = 'close';
      }

      // Create stars array
      let stars = Array(8).fill("★");

      // Replace stars based on phase and admin inputs
   // 1st to 3rd stars from patte1
      for (let i = 0; i < 3; i++) {
        if (patte1 && patte1.length > i) {
          stars[i] = patte1.charAt(i);
        }
      }

      // 4th star from patte1_open
      if (patte1_open && patte1_open.length > 0) {
        stars[3] = patte1_open.charAt(0);
      }

      // 5th star from patte2_close
      if (patte2_close && patte2_close.length > 0) {
        stars[4] = patte2_close.charAt(0);
      }

      // 6th to 8th stars from patte2
      for (let i = 0; i < 3; i++) {
        if (patte2 && patte2.length > i) {
          stars[5 + i] = patte2.charAt(i);
        }
      }

      let starsWithDashes = [
      ...stars.slice(0, 3),  // first 3 stars
      '-',                   // dash after 3rd star
      stars[3],              // 4th star
      stars[4],              // 5th star
      '-',                   // dash after 5th star
      ...stars.slice(5, 8),  // 6th to 8th stars
    ];

      return {
        id: game.id,
        game_name: game.game_name,
        starsWithDashes,
        open_time: game.open_time,
        close_time: game.close_time,
        phase,
      };
    });

    res.json({ games: resultGames });
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

    const [games] = await db.query(
      `SELECT id, game_name, open_time, close_time FROM games ORDER BY id DESC`
    );

    const gameIds = games.map(g => g.id);
    let resultsMap = {};
    if (gameIds.length > 0) {
      const [results] = await db.query(
        `SELECT game_id, patte1, patte1_open, patte2_close, patte2, input_date
         FROM game_inputs
         WHERE game_id IN (?) AND input_date = ?`,
        [gameIds, todayIST]
      );
      results.forEach(r => {
        resultsMap[r.game_id] = `
        ${r.patte1 || ""}-${r.patte1_open || ""}${r.patte2_close || ""}-${r.patte2 || ""}`.replace(/(^-+|-+$)/g,'').replace(/-+/g,'-').replace(/-+$/, "");
      });
    }

    const data = games.map(g => ({
      game_name: g.game_name,
      result: resultsMap[g.id] || "",
      timing: `${convertTo12HourFormat(g.open_time.slice(0,5))} - ${convertTo12HourFormat(g.close_time.slice(0,5))}`
    }));

    res.json({ games: data });
  } catch (err) {
    console.error("getPublicGameResults error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};











