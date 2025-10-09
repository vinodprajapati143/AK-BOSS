// controllers/users.controller.js
const db = require("../config/db");
const bcrypt = require('bcrypt');


exports.listUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.username, 
        u.registerType, 
        rr.invite_code AS invitecode, -- referral_relations ka invite_code
        u.phone, 
        u.joiningdate
      FROM users u
      LEFT JOIN referral_relations rr 
        ON u.id = rr.invitee_id   -- relation user ke id se match hoga
      ORDER BY u.id DESC
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

// User Profile Controller
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // 👈 auth middleware se aayega

    const [rows] = await db.query(
      "SELECT id, username, registerType, phone, countryCode, joiningDate FROM users WHERE id = ?",
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: rows[0]   // 👈 ab id ke saath details aayengi
    });
  } catch (err) {
    console.error("Profile API Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// User Profile Controller
exports.updateUserProfile = async (req, res) => {
  try {
    const { id, username, phone, countryCode } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID required" });
    }

    // Update query
    const [result] = await db.query(
      "UPDATE users SET username = ?, phone = ?, countryCode = ? WHERE id = ?",
      [username, phone, countryCode, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found or no changes" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (err) {
    console.error("Update Profile API Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllUsersWithWallet = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id AS user_id,
        u.username,
        u.registerType,
        u.phone,

        COALESCE(
          (SELECT balance_after 
           FROM user_wallet uw 
           WHERE uw.user_id = u.id 
           ORDER BY uw.id DESC LIMIT 1), 0
        ) AS normal_balance
      FROM users u
    `);
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users with wallet balances.' });
  }
};

exports.transferBalance = async (req, res) => {
  try {
    const operatorId = req.user.id;
    const { userId, amount, remark, password } = req.body;

     // Input validation
    if (!userId || !amount || !password) {
      return res.status(400).json({ message: 'Required fields missing.' });
    }
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number.' });
    }
    if (userId === operatorId) {
      return res.status(400).json({ message: 'Cannot transfer to own account.' });
    }

    // 1. Fetch operator ka hashed password
    const [userRows] = await db.query('SELECT pwd FROM users WHERE id = ?', [operatorId]);
    if (!userRows.length) {
      return res.status(400).json({ message: 'Operator not found.' });
    }

    // 2. Compare input password with hash (exactly like login)
    const validPass = await bcrypt.compare(password, userRows[0].pwd);
    if (!validPass) {
      return res.status(400).json({ message: 'Incorrect login password.' });
    }

    // 3. Further balance transfer logic...
  // Fetch receiver's last balance
    const [walletRows] = await db.query(
      'SELECT balance_after FROM user_wallet WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [userId]
    );
    const currentBalance = walletRows.length ? Number(walletRows[0].balance_after) : 0;
    const newBalance = currentBalance + Number(amount);

    // Insert new wallet transaction
    await db.query(
      'INSERT INTO user_wallet (user_id, transaction_type, amount, balance_after, description, reference_id, created_at) VALUES (?, ?, ?, ?, ?, NULL, NOW())',
      [userId, 'CREDIT', amount, newBalance, remark || 'Balance transfer']
    );

    return res.json({ message: 'Balance transferred successfully.', balance: newBalance });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong.', error: err.message });
  }
};





