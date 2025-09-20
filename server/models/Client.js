const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  contactNumber: String, // add this
  address: String,
  businessName: String,
  gstNumber: String,      // add this
  panNumber: String,      // add this
  identityProofs: [String],
  documents: [
    { name: String, url: String, uploadedAt: Date }
  ],
}, { timestamps: true });


module.exports = mongoose.model("Client", clientSchema);
