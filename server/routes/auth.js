const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

router.post("/login", async (req, res) => {
  const { username, password , mfaCode } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Missing username or password" });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    res.json({ msg: "Password verified, provide TOTP code", adminId: admin._id });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});
router.post("/verify-mfa", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { adminId, token } = req.body;

    if (!adminId || !token) {
      console.log("Missing adminId or token");
      return res.status(400).json({ msg: "Missing adminId or TOTP token" });
    }

    const tokenStr = String(token).trim();
    console.log("Token string:", tokenStr);

    const admin = await Admin.findById(adminId);
    console.log("Admin found:", admin);

    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    if (!admin.mfaSecret) {
      console.log("Admin MFA secret missing");
      return res.status(500).json({ msg: "Admin does not have MFA secret set" });
    }

    const speakeasy = require("speakeasy");
    const verified = speakeasy.totp.verify({
      secret: admin.mfaSecret,
      encoding: "base32",
      token: tokenStr,
      window: 1,
    });
    console.log("TOTP verified:", verified);

    if (!verified) return res.status(401).json({ msg: "Invalid TOTP code" });

    const jwt = require("jsonwebtoken");
    const tokenJWT = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    console.log("JWT generated");
    return res.json({ msg: "MFA verified", token: tokenJWT });
  } catch (err) {
    console.error("Full MFA verification error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});




module.exports = router;
