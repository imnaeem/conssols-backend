import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configure Cloudinary with environment variable
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  throw new Error("CLOUDINARY_URL environment variable is not set");
}

// Parse CLOUDINARY_URL: cloudinary://api_key:api_secret@cloud_name
const url = new URL(cloudinaryUrl);
const cloud_name = url.hostname;
const api_key = url.username;
const api_secret = url.password;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

// Configure multer for handling multipart/form-data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload image endpoint
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Convert buffer to base64 for Cloudinary upload
    const fileBase64 = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary with proper configuration
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "conssols", // Organize images in conssols folder
      resource_type: "image",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" }, // Limit max dimensions
        { quality: "auto" }, // Auto optimize quality
        { fetch_format: "auto" }, // Auto format (webp when supported)
      ],
    });

    // Return the secure URL
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Image upload failed",
      details: error.message,
    });
  }
});

// Delete image endpoint (optional)
router.delete("/delete/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      error: "Image deletion failed",
      details: error.message,
    });
  }
});

export default router;
