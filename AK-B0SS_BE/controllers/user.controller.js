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
  const [rows] = await db.query("SELECT id, phone, invitecode FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new Error("User not found");

  let user = rows[0];

  if (user.invitecode && user.invitecode.trim() !== '') {
    console.log('Existing invitecode found:', user.invitecode);
    return user.invitecode;
  }

  const newInviteCode = `AK_${user.phone}`;
  const updateResult = await db.query("UPDATE users SET invitecode = ? WHERE id = ?", [newInviteCode, userId]);
  console.log('Update Result:', updateResult);

  // Confirm update
  const [updatedUser] = await db.query("SELECT invitecode FROM users WHERE id = ?", [userId]);
  console.log('Updated invitecode after update:', updatedUser[0].invitecode);

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

exports.getReferralList = async (req, res) => {
  try {
    const referrerId = req.user.id; // Logged in user ID from auth

    const sql = `
      SELECT rr.id, rr.invite_code, u.username AS invitee_username, u.phone AS invitee_phone, rr.created_at
      FROM referral_relations rr
      JOIN users u ON rr.invitee_id = u.id
      WHERE rr.referrer_id = ?
      ORDER BY rr.created_at DESC
    `;

    const [referrals] = await db.query(sql, [referrerId]);

    return res.json({ success: true, referrals });
  } catch (error) {
    console.error("Referral List API error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

