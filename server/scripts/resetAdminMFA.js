require("dotenv").config();
const mongoose = require("mongoose");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode-terminal");
const Admin = require("../models/Admin"); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI;

async function resetMFA(username) {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log("Admin not found");
      process.exit(1);
    }

    // Generate new MFA secret
    const secret = speakeasy.generateSecret({ name: `KYC-Platform (${username})` });
    admin.mfaSecret = secret.base32;
    await admin.save();

    console.log("✅ MFA secret reset successfully!");
    console.log("Secret (base32):", secret.base32);

    console.log("Scan this QR code in Google Authenticator:");
    qrcode.generate(secret.otpauth_url, { small: true });

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// Replace 'admin' with your admin username
resetMFA("admin");
