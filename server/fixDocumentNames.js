const mongoose = require("mongoose");
const Client = require("./models/Client");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function fixDocumentNames() {
  try {
    const clients = await Client.find();

    for (const client of clients) {
      let updated = false;

      client.documents = client.documents.map((doc) => {
        if (!doc.name && doc.url) {
          // Extract filename from URL
          const parts = doc.url.split("/");
          const filenameWithQuery = parts[parts.length - 1];
          const filename = filenameWithQuery.split("?")[0]; // remove query params
          updated = true;
          return { ...doc.toObject(), name: filename };
        }
        return doc;
      });

      if (updated) {
        await client.save();
        console.log(`✅ Updated client: ${client.fullName}`);
      }
    }

    console.log("All documents fixed!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating documents:", err);
    process.exit(1);
  }
}

fixDocumentNames();
