const db = require("../config/db");

exports.createWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, payment_method } = req.body; // Only amount and method from frontend

    // 1. Basic validations
    if (!amount || amount < 1000) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹1000' });
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

    // 5. Save withdrawal request
    await db.query(
      `INSERT INTO withdrawal_requests
        (user_id, amount, payment_method, phone_number, account_holder_name, account_number, ifsc_code, upi_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId,
        amount,
        payment_method,
        phone_number,
        account_holder_name,
        account_number,
        ifsc_code,
        upi_id
      ]
    );

    // 6. Deduct amount from wallet (temporary)
    const newBalance = currentBalance - amount;
    await db.query(
      `INSERT INTO user_wallet 
        (user_id, transaction_type, amount, balance_after, description, created_at)
      VALUES (?, 'DEBIT', ?, ?, ?, NOW())`,
      [userId, amount, newBalance, `Withdrawal request (${payment_method}) of ₹${amount} (pending)`]
    );

    return res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Admin will process within 24-48h.',
      balance: newBalance
    });

  } catch (error) {
    console.error('Error creating withdrawal request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
