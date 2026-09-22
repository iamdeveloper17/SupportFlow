import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/generateTokens.js";
import User from "../models/User.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) throw new ApiError(401, "Unauthorized - no token");

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded._id).select("-password -refreshToken");

  if (!user) throw new ApiError(401, "Invalid access token");

  req.user = user;
  next();
});

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden - insufficient permissions");
    }
    next();
  };
};

export const requireWorkspace = (req, res, next) => {
  if (!req.user.workspace && req.user.role !== "super_admin") {
    throw new ApiError(403, "No workspace assigned");
  }
  req.workspaceId = req.user.workspace;
  next();
};