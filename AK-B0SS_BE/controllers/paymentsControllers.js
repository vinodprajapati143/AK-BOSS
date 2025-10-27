const db = require("../config/db");

exports.savePaymentDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      bank_phone_number,
      bank_account_holder_name,
      bank_account_number,
      bank_ifsc_code,
      upi_phone_number,
      upi_account_holder_name,
      upi_id
    } = req.body;

    // Check if user already has record
    const [existingRows] = await db.query(
      `SELECT * FROM user_payment_details WHERE user_id = ?`,
      [userId]
    );

    // No record exists, insert new
    if (!existingRows.length) {
      await db.query(
        `INSERT INTO user_payment_details 
          (user_id, bank_phone_number, bank_account_holder_name, bank_account_number, bank_ifsc_code,
           upi_phone_number, upi_account_holder_name, upi_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          bank_phone_number || null,
          bank_account_holder_name || null,
          bank_account_number || null,
          bank_ifsc_code || null,
          upi_phone_number || null,
          upi_account_holder_name || null,
          upi_id || null
        ]
      );
      return res.status(201).json({
        success: true,
        message: "Payment details saved successfully"
      });
    }

    // Record exists -- check which part is missing
    const existing = existingRows[0];
    // Bank details save allowed only if all are null
    if (
      (bank_account_number && !existing.bank_account_number)
      || (bank_ifsc_code && !existing.bank_ifsc_code)
      || (bank_account_holder_name && !existing.bank_account_holder_name)
      || (bank_phone_number && !existing.bank_phone_number)
    ) {
      // Only allow update if bank fields are still missing for this user
      await db.query(
        `UPDATE user_payment_details 
         SET bank_phone_number = ?, bank_account_holder_name = ?, bank_account_number = ?, bank_ifsc_code = ?
         WHERE user_id = ?`,
        [
          bank_phone_number || existing.bank_phone_number,
          bank_account_holder_name || existing.bank_account_holder_name,
          bank_account_number || existing.bank_account_number,
          bank_ifsc_code || existing.bank_ifsc_code,
          userId
        ]
      );
      return res.status(200).json({
        success: true,
        message: "Bank details added successfully"
      });
    }
    // UPI details save allowed only if all are null
    if (
      (upi_id && !existing.upi_id)
      || (upi_account_holder_name && !existing.upi_account_holder_name)
      || (upi_phone_number && !existing.upi_phone_number)
    ) {
      await db.query(
        `UPDATE user_payment_details 
         SET upi_phone_number = ?, upi_account_holder_name = ?, upi_id = ?
         WHERE user_id = ?`,
        [
          upi_phone_number || existing.upi_phone_number,
          upi_account_holder_name || existing.upi_account_holder_name,
          upi_id || existing.upi_id,
          userId
        ]
      );
      return res.status(200).json({
        success: true,
        message: "UPI details added successfully"
      });
    }

    // Har field already filled, not allowed to edit!
    return res.status(400).json({
      success: false,
      message: "Both Bank and UPI payment details already saved. For changes, please contact support."
    });

  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


exports.getPaymentDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const [details] = await db.query(
      `SELECT 
         bank_phone_number,
         bank_account_holder_name,
         bank_account_number,
         bank_ifsc_code,
         upi_phone_number,
         upi_account_holder_name,
         upi_id
       FROM user_payment_details
       WHERE user_id = ?`,
      [userId]
    );

    if (details.length) {
      return res.json({
        success: true,
        payment_details: details[0]
      });
    } else {
      return res.json({
        success: true,
        payment_details: null
      });
    }

  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

