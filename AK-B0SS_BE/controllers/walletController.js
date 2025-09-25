const db = require('../db');

// Get User Wallet Balance (latest)
exports.getUserWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      "SELECT balance_after FROM user_wallet WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      [userId]
    );
    const balance = rows.length ? rows[0].balance_after : 0;
    res.json({ user_id: userId, balance });
  } catch (err) {
    res.status(500).json({ message: 'Error getting wallet balance.' });
  }
};

 
