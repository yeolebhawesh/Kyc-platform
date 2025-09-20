const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    mfaSecret: { type: String, required: true }, // TOTP secret
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
