// scripts/resetAdminPassword.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

dotenv.config();

async function resetPassword(username, newPassword) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Find the admin and update the password
    const admin = await Admin.findOneAndUpdate(
      { username },
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      console.log("❌ Admin not found");
    } else {
      console.log("✅ Password updated successfully for admin:", username);
    }

    // Close the MongoDB connection
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating password:", err);
    process.exit(1);
  }
}

// Get username and new password from command line arguments
const [username, newPassword] = process.argv.slice(2);
if (!username || !newPassword) {
  console.log("Usage: node scripts/resetAdminPassword.js <username> <newPassword>");
  process.exit(1);
}

// Run the password reset function
resetPassword(username, newPassword);
