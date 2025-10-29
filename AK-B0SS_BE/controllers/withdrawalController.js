const db = require("../config/db");

exports.createWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, payment_method } = req.body; // Only amount and method from frontend

    // 1. Basic validations
    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹100' });
    }
    if (!['upi', 'bank', 'wallet'].includes(payment_method)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // 2. Balance check
    const [walletRows] = await db.query(
      "SELECT balance_after FROM user_wallet WHERE user_id=? ORDER BY id DESC LIMIT 1",
      [userId]
    );
    const currentBalance = walletRows.length ? Number(walletRows[0].balance_after) : 0;
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 3. Check for pending withdrawal requests
    const [pending] = await db.query(
      `SELECT id FROM withdrawal_requests WHERE user_id=? AND status='pending'`,
      [userId]
    );
    if (pending.length) {
      return res.status(400).json({ message: 'You already have a pending withdrawal request. Please wait for it to be processed.' });
    }

    // 4. Get payment details (readonly for user)
    const [details] = await db.query(
      `SELECT * FROM user_payment_details WHERE user_id = ?`,
      [userId]
    );
    if (!details.length) {
      return res.status(400).json({ message: 'Payment details not found, please contact support.' });
    }
    const d = details[0];
    let phone_number = null, account_holder_name = null, account_number = null, ifsc_code = null, upi_id = null;

    if (payment_method === 'upi') {
      if (!d.upi_id || !d.upi_account_holder_name) {
        return res.status(400).json({ message: 'UPI details missing. Contact support.' });
      }
      phone_number = d.upi_phone_number;
      account_holder_name = d.upi_account_holder_name;
      upi_id = d.upi_id;
    } else if (payment_method === 'bank') {
      if (!d.bank_account_number || !d.bank_ifsc_code) {
        return res.status(400).json({ message: 'Bank details missing. Contact support.' });
      }
      phone_number = d.bank_phone_number;
      account_holder_name = d.bank_account_holder_name;
      account_number = d.bank_account_number;   
      ifsc_code = d.bank_ifsc_code;
    }

    // 5. Generate next batch_id in withdraw_XXXX format
    const [lastBatch] = await db.query(
      "SELECT batch_id FROM withdrawal_requests WHERE batch_id IS NOT NULL ORDER BY id DESC LIMIT 1"
    );

    let batchNo = 1;
    if (lastBatch.length && lastBatch[0].batch_id) {
      const match = lastBatch[0].batch_id.match(/withdraw_(\d+)/);
      if (match && match[1]) {
        batchNo = parseInt(match[1]) + 1;
      }
    }
    const batchId = `withdraw_${batchNo.toString().padStart(5, '0')}`;

    // 6. Save withdrawal request
    await db.query(
      `INSERT INTO withdrawal_requests
        (user_id, amount, payment_method, phone_number, account_holder_name, account_number, ifsc_code, upi_id, batch_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        amount,
        payment_method,
        phone_number,
        account_holder_name,
        account_number,
        ifsc_code,
        upi_id,
        batchId
      ]
    );

    // 7. Deduct amount from wallet (temporary) with batch_id
    const newBalance = currentBalance - amount;
    await db.query(
      `INSERT INTO user_wallet 
        (user_id, transaction_type, amount, balance_after, description, batch_id, created_at)
      VALUES (?, 'DEBIT', ?, ?, ?, ?, NOW())`,
      [userId, amount, newBalance, `Withdrawal request (${payment_method}) of ₹${amount} (pending)`, batchId]
    );

    return res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Admin will process within 24-48h.',
      batchId,
      balance: newBalance
    });

  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getWithdrawalsWithBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Withdrawal list (latest first)
    const [withdrawals] = await db.query(
      "SELECT * FROM withdrawal_requests WHERE user_id = ? ORDER BY requested_at DESC",
      [userId]
    );

    // 2. Sabhi withdrawals ka time/ID loop karke balances nikaalo
    const withdrawalWithBalances = [];
    for (const w of withdrawals) {
      // Closing balance at/after withdrawal time
      const [closingWallet] = await db.query(
        "SELECT balance_after FROM user_wallet WHERE user_id = ? AND created_at <= ? ORDER BY created_at DESC LIMIT 1",
        [userId, w.requested_at]
      );
      const closing = closingWallet.length ? Number(closingWallet[0].balance_after) : 0;

      // Opening balance = last wallet entry before this withdrawal
      const [openingWallet] = await db.query(
        "SELECT balance_after FROM user_wallet WHERE user_id = ? AND created_at < ? ORDER BY created_at DESC LIMIT 1",
        [userId, w.requested_at]
      );
      const opening = openingWallet.length ? Number(openingWallet[0].balance_after) : 0;

      withdrawalWithBalances.push({
        ...w,
        opening_balance: opening,
        closing_balance: closing
      });
    }

    return res.status(200).json(withdrawalWithBalances);
  } catch (err) {
    console.error("Withdrawal List Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/admin/withdrawals
exports.getAllWithdrawalRequests = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        wr.id,
        wr.user_id,
        u.username   AS user_name,
        wr.amount,
        wr.bank,
        wr.payment_method,
        wr.requested_at,
        wr.processed_at,
        wr.status,
        wr.admin_remarks,
        wr.account_holder_name,
        wr.account_number,
        wr.upi_id,
        wr.ifsc_code,
        wr.phone_number,
        wr.batch_id
       FROM withdrawal_requests wr
       LEFT JOIN users u ON wr.user_id = u.id
       ORDER BY wr.requested_at DESC`
    );

    // Optional: sanitize output, format dates, add missing defaults
    const formattedRows = rows.map(row => ({
      ...row,
      requested_at: row.requested_at ? new Date(row.requested_at).toISOString() : null,
      processed_at: row.processed_at ? new Date(row.processed_at).toISOString() : null,
      amount: Number(row.amount),
      status: row.status || 'pending'
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Withdrawal fetch error:', error);
    res.status(500).json({message: 'Failed to fetch withdrawal requests'});
  }
};






