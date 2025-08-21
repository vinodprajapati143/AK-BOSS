
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");



exports.register = async (req, res) => {
  try {
    const {
      username,
      smsvcode,
      registerType,
      pwd,
      invitecode,
      domainurl,
      phonetype,
      captchaId,
      track,
      deviceId,
      language,
      random,
      signature,
      timestamp,
      phone,
      countryCode,
      agree,
    } = req.body;

    // ✅ Required Field Validations
    if (!username || !pwd) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
    }

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }
    // ✅ Phone Format Check (optional)
    if (phone && !/^\d{6,15}$/.test(phone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number" });
    }
    // ✅ Password Strength Check
    if (pwd.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
    }

    if (agree !== true) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You must agree to the terms and conditions",
        });
    }

    // ✅ Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    }

    // ✅ Hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const sql = `
      INSERT INTO users (
        username, smsvcode, registerType, pwd, invitecode,
        domainurl, phonetype, captchaId, track, deviceId,
        language, random, signature, timestamp,
        phone, countryCode, agree
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username,
      smsvcode,
      registerType,
      hashedPwd,
      invitecode,
      domainurl,
      phonetype,
      captchaId,
      track,
      deviceId,
      language,
      random,
      signature,
      timestamp,
      phone,
      countryCode,
      agree,
    ];

    await db.query(sql, values);

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// login api
exports.loginUser = async (req, res) => {
  try {
    const {
      phone,
      pwd,
      phonetype,
      logintype,
      language,
      random,
      signature,
      timestamp,
      countryCode
    } = req.body;

    if (!phone || !pwd) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    // ✅ Use await with promisePool
    const [result] = await db.query(`SELECT * FROM users WHERE phone = ? LIMIT 1`, [phone]);

    if (result.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username || user.phone,
      registerType: user.registerType,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        registerType: user.registerType,
        countryCode,
        phonetype,
        logintype,
        language,
        random,
        signature,
        timestamp,
      },
    });
  } catch (error) {
    console.error("Catch Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
  }catch (error) {
    console.error("Catch Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.sendForgotOtp = async (req, res) => {
  const { phone, countryCode } = req.body;

  if (!phone || !countryCode) {
    return res.status(400).json({ success: false, message: "Phone and country code required" });
  }

  try {
    // 1️⃣ User check
    const [user] = await db.query(
      "SELECT * FROM users WHERE phone = ? AND countryCode = ?",
      [phone, countryCode]
    );
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiryMinutes = 2;

    // 3️⃣ Send OTP via WhatsApp (Sarobotic API)
    const apiKey = process.env.SAROBOTIC_API_KEY;
    const message = encodeURIComponent(
      `Well Come To ak247pro.com \n\nYour OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`
    );

    const url = `https://www.sarobotic.in/api/whatsapp/send?contacts=${countryCode}${phone}&message=${message}`;

    const response = await axios.get(url, {
      headers: { "Api-key": apiKey }
    });

    // 4️⃣ Check API response
    if (response.data.success) {
      // ✅ Save OTP in DB only if sent successfully
      await db.query(
        "UPDATE users SET otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE phone = ? AND countryCode = ?",
        [otp, expiryMinutes, phone, countryCode]
      );

      return res.status(200).json({ success: true, message: "OTP sent via WhatsApp successfully" });
    } else {
      return res.status(500).json({ success: false, message: "Failed to send OTP via WhatsApp" });
    }

  } catch (error) {
    console.error("Sarobotic WhatsApp OTP Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



exports.verifyOtpAndResetPassword = async (req, res) => {
  const { phone, countryCode, otp, newPassword } = req.body;

  if (!phone || !countryCode || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const [user] = await db.query(
      'SELECT * FROM users WHERE phone = ? AND countryCode = ?',
      [phone, countryCode]
    );

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const dbUser = user[0];
    const now = new Date();
    const expiry = new Date(dbUser.otp_expiry);

    // ✅ OTP match check
    if (dbUser.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ OTP expiry check
    if (now > expiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // ✅ Hash new password
    const hashedPwd = await bcrypt.hash(newPassword, 10);

    // ✅ Update password in DB and clear OTP
    await db.query(
      'UPDATE users SET pwd = ?, otp = NULL, otp_expiry = NULL WHERE phone = ? AND countryCode = ?',
      [hashedPwd, phone, countryCode]
    );

    res.status(200).json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};







