// import { Router } from "express";
// import { upload } from "../config/cloudinary.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import ApiError from "../utils/ApiError.js";
// import asyncHandler from "../utils/asyncHandler.js";

// const router = Router();

// router.post(
//   "/",
//   verifyJWT,
//   upload.single("file"),
//   asyncHandler(async (req, res) => {
//     if (!req.file) throw new ApiError(400, "No file uploaded");
//     res.json(
//       new ApiResponse(
//         200,
//         {
//           url: req.file.path,
//           name: req.file.originalname,
//           size: req.file.size,
//         },
//         "File uploaded"
//       )
//     );
//   })
// );

// export default router;

import { Router } from "express";
import { upload } from "../config/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();

// Conditional middleware — agar upload available hai to use karo, warna 503
const uploadMiddleware = (req, res, next) => {
  if (!upload) {
    return next(
      new ApiError(
        503,
        "File upload is not configured. Please add Cloudinary keys in server/.env"
      )
    );
  }
  return upload.single("file")(req, res, next);
};

router.post(
  "/",
  verifyJWT,
  uploadMiddleware,
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "No file uploaded");
    res.json(
      new ApiResponse(
        200,
        {
          url: req.file.path,
          name: req.file.originalname,
          size: req.file.size,
        },
        "File uploaded"
      )
    );
  })
);

export default router;