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

async function generateReferralCode(userId) {
  // 1. Get user data by Id
  const [rows] = await db.query("SELECT id, phone, invitecode FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new Error("User not found");

  let user = rows[0];

  // 2. Agar already invitecode hai, wahi return karo
  if (user.invitecode && user.invitecode.trim() !== '') {
    return user.invitecode;
  }

  // 3. Referral code generate karo (prefix + phone, ya kisi aur unique logic)
  const newInviteCode = `AK_${user.phone}`;

  // 4. Database me update karo
  await db.query("UPDATE users SET invitecode = ? WHERE id = ?", [newInviteCode, userId]);

  return newInviteCode;
}

exports.getReferralCode = async (req, res) => {
  try {
    const userId = req.user.id; // JWT/token se ya session se aayega

    const inviteCode = await generateReferralCode(userId);

    res.json({ inviteCode });
  } catch (err) {
    console.error('Error generating referral code:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
