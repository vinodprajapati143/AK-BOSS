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

    // Check if user already saved payment details
    const [existing] = await db.query(
      `SELECT id FROM user_payment_details WHERE user_id = ?`,
      [userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Payment details already saved. To change details, please contact support."
      });
    }

    // Insert new payment details
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

    res.status(201).json({
      success: true,
      message: "Payment details saved successfully"
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

