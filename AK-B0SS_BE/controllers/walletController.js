const db = require("../config/db");
const axios = require('axios');
const EKQR_API_KEY = process.env.EKQR_API_KEY;


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

exports.createAddMoneyOrder = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware
    console.log('user: ', user);
    const { amount } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: "Minimum amount is ₹1" });
    }

    // 1. Create unique client_txn_id each request
    const client_txn_id = Date.now() + '_' + user.id + '_' + Math.round(Math.random() * 10000);

    // 2. Prepare API request payload
    const payload = {
      key: EKQR_API_KEY,
      client_txn_id,
      amount: String(amount),
      p_info: "Wallet Recharge",
      customer_name: user.username || "User",
      customer_email: user.email || "noemail@example.com",
      customer_mobile: user.phone || "9999999999",
      redirect_url: "https://ak247pro.com/user/add-amount", // Or wherever you want (handle result here)
      udf1: user.id.toString()
    };

    // 3. Call ekQR API (with error handling)
    const ekqrResp = await axios.post('https://api.ekqr.in/api/create_order', payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!ekqrResp.data.status) {
      return res.status(400).json({ success: false, message: ekqrResp.data.msg || 'Gateway order create failed' });
    }

    // 4. Insert this order in payment_orders with status pending
    await db.query(
      `INSERT INTO payment_orders (client_txn_id, user_id, amount, status, created_at)
       VALUES (?, ?, ?, 'pending', NOW())`,
      [client_txn_id, user.id, amount]
    );

    // 5. Return payment_url and order id to frontend
    res.json({
      success: true,
      payment_url: ekqrResp.data.data.payment_url,
      client_txn_id
    });
  } catch (err) {
    console.error('createAddMoneyOrder', err?.response?.data || err);
    res.status(500).json({ success: false, message: 'Internal error. Please try again.' });
  }
};

exports.ekqrWebhook = async (req, res) => {
  try {
    const data = req.body;
    const { client_txn_id, status, amount, upi_txn_id, remark, id } = data;

    // 1. Check if already credited (idempotency)
    const [alreadyCredited] = await db.query(
      "SELECT id FROM user_wallet WHERE description=? AND transaction_type='CREDIT'",
      [`UPI Recharge ${client_txn_id}`]
    );
    if (alreadyCredited.length) return res.status(200).send('Already credited');

    // 2. Fetch user_id from payment_orders
    const [orderRows] = await db.query(
      "SELECT user_id, amount FROM payment_orders WHERE client_txn_id = ? LIMIT 1",
      [client_txn_id]
    );
    if (!orderRows.length) return res.status(400).send('Payment order not found');

    // 3. On success, credit wallet
    if (status === "success") {
      const userId = orderRows[0].user_id;
      const newAmt = Number(amount);
      const [walletRows] = await db.query(
        "SELECT balance_after FROM user_wallet WHERE user_id=? ORDER BY id DESC LIMIT 1",
        [userId]
      );
      const oldBal = walletRows.length ? Number(walletRows[0].balance_after) : 0;
      const newBal = oldBal + newAmt;
      await db.query(
        `INSERT INTO user_wallet (user_id, transaction_type, amount, balance_after, description, related_transaction, created_at)
         VALUES (?, 'CREDIT', ?, ?, ?, ?, NOW())`,
        [userId, newAmt, newBal, `UPI Recharge ${client_txn_id}`, upi_txn_id || id]
      );
      await db.query("UPDATE payment_orders SET status='success', payment_id=?, remark=?, completed_at=NOW() WHERE client_txn_id=?", [upi_txn_id || id, remark || "", client_txn_id]);
      return res.status(200).send('Wallet credited');
    } else {
      // On fail, just update payment_orders status
      await db.query("UPDATE payment_orders SET status='failed', remark=? WHERE client_txn_id=?", [remark || "fail", client_txn_id]);
      return res.status(200).send('Failed marked');
    }
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('Webhook error');
  }
};



 
