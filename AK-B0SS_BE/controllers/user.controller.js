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
    return user.invitecode;
  }

  const newInviteCode = `AK_${user.phone}`;

  

  return newInviteCode;
}


// GENERATE REFERRAL CODE API (if needed separately)
exports.getReferralCode = async (req, res) => {
  try {
    const userId = req.user.id; // JWT/token se ya session se aayega
    const [rows] = await db.query("SELECT invitecode FROM users WHERE id = ?", [userId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ inviteCode: rows[0].invitecode });
  } catch (err) {
    console.error('Error fetching referral code:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getReferralList = async (req, res) => {
  try {
    const referrerId = req.user.id;

    const sql = `
      SELECT rr.id, 
             rr.invite_code AS referrer_code,
             u.username AS invitee_username,
             u.phone AS invitee_phone,
             u.invitecode AS invitee_code,
             rr.created_at
      FROM referral_relations rr
      JOIN users u ON rr.invitee_id = u.id
      WHERE rr.referrer_id = ?
      ORDER BY rr.created_at DESC
    `;

    const [referrals] = await db.query(sql, [referrerId]);

    // Mask last 5 characters of invitee_code
    const maskedReferrals = referrals.map(r => {
      if (r.invitee_code && r.invitee_code.length > 5) {
        const visiblePart = r.invitee_code.slice(0, -5);
        r.invitee_code = visiblePart + "*****";
      }
      return r;
    });

    return res.json({ success: true, referrals: maskedReferrals });
  } catch (error) {
    console.error("Referral List API error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


