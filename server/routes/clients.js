const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");
const Client = require("../models/Client");
const cloudinary = require("../utils/cloudinary");
const authMiddleware = require("../middleware/auth");

const upload = multer();

// GET all clients
router.get("/", authMiddleware, async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET single client + signed doc URLs
// server/routes/clients.js, GET client by ID
router.get("/:clientId", authMiddleware, async (req, res) => {
  const client = await Client.findById(req.params.clientId);
  if (!client) return res.status(404).json({ msg: "Client not found" });

  const docsWithUrls = client.documents.map((doc) => ({
    ...doc.toObject ? doc.toObject() : doc,
    downloadUrl: `/api/clients/${client._id}/documents/${doc._id}/download`,
  }));

  res.json({ ...client.toObject(), documents: docsWithUrls });
});

// server/routes/clients.js
router.get("/:clientId/documents/:docId/download", authMiddleware, async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) return res.status(404).json({ msg: "Client not found" });

    const doc = client.documents.id(req.params.docId);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    // Cloudinary raw download
    res.redirect(doc.url); // this will let browser download or preview the file
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});



// Add new client
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fullName, email, contactNumber, address, businessName, gstNumber, panNumber, identityProofs } = req.body;

    const client = new Client({
      fullName,
      email,
      contactNumber,
      address,
      businessName,
      gstNumber,
      panNumber,
      identityProofs: identityProofs || [],
      documents: [],
    });

    await client.save();
    res.status(201).json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// server/routes/clients.js

router.post(
  "/:clientId/upload",
  authMiddleware,          // must be before multer
  upload.array("files", 5),
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.clientId);
      if (!client) return res.status(404).json({ msg: "Client not found" });
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "No files uploaded" });
      }

      const uploadPromises = req.files.map((file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "kyc_docs" },
            (error, result) => (error ? reject(error) : resolve({ name: file.originalname, url: result.secure_url }))
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
      );

      const results = await Promise.all(uploadPromises);
      client.documents.push(...results.map((r) => ({ ...r, uploadedAt: new Date() })));
      await client.save();

      res.json({ msg: "Documents uploaded", client });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);


module.exports = router;
