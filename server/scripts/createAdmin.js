const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const Admin = require("../models/Admin");

dotenv.config();

async function createAdmin(username, password) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("❌ Admin already exists!");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mfaSecret = speakeasy.generateSecret({ name: process.env.TOTP_APP_NAME || "KYC-Portal" });

    const admin = new Admin({ username, password: hashedPassword, mfaSecret: mfaSecret.base32 });
    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("Username:", username);
    console.log("MFA Secret:", mfaSecret.base32);

    QRCode.toString(mfaSecret.otpauth_url, { type: "terminal" }, (err, url) => {
      if (err) throw err;
      console.log("Scan this QR in Google Authenticator:");
      console.log(url);
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

const [username, password] = process.argv.slice(2);
if (!username || !password) {
  console.log("Usage: node scripts/createAdmin.js <username> <password>");
  process.exit(1);
}
createAdmin(username, password);
