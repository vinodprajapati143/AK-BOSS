// controllers/users.controller.js
const db = require("../config/db");


exports.listUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        username, 
        registerType, 
        invitecode, 
        phone, 
        joiningdate
      FROM users
      ORDER BY id DESC
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
