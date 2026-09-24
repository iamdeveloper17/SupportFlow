import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

let upload = null;

// ✅ Simple check — values exist karti hain ya nahi
const hasValidConfig = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

console.log("🔍 Cloudinary config check:");
console.log("   CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("   API_KEY:", process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING");
console.log("   API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING");
console.log("   hasValidConfig:", hasValidConfig);

if (hasValidConfig) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "supportflow/tickets",
        allowed_formats: ["jpg", "jpeg", "png", "pdf", "docx", "txt"],
        resource_type: "auto",
      },
    });

    upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 },
    });

    console.log("✅ Cloudinary initialized");
  } catch (err) {
    console.error("❌ Cloudinary init error:", err.message);
  }
} else {
  console.log("⚠️  Cloudinary disabled (missing config)");
}

export { upload };
export default cloudinary;