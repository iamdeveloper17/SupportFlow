// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "supportflow/tickets",
//     allowed_formats: ["jpg", "jpeg", "png", "pdf", "docx", "txt"],
//     resource_type: "auto",
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// export default cloudinary;

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

let upload = null;

const hasValidConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "xxxxx" &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== "xxxxx";

if (hasValidConfig) {
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
} else {
  console.log("⚠️  Cloudinary disabled (no valid config)");
}

export { upload };
export default cloudinary;