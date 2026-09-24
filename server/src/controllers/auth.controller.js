import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/User.model.js";
import Workspace from "../models/Workspace.model.js";
import { slugify } from "../utils/slugify.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/generateTokens.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

// REGISTER — creates Workspace + Admin user
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, workspaceName } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already registered");

  // 1. User pehle banao (workspace ke bina)
  const user = await User.create({
    name,
    email,
    password,
    role: "admin",
    workspace: null,
  });

  // 2. Ab workspace banao (owner ke saath)
  let slug = slugify(workspaceName);
  const slugExists = await Workspace.findOne({ slug });
  if (slugExists) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const workspace = await Workspace.create({
    name: workspaceName,
    slug,
    owner: user._id, // ✅ owner ab diya
  });

  // 3. User ko workspace se link karo
  user.workspace = workspace._id;
  await user.save();

  // 4. Tokens generate karo
  const accessToken = generateAccessToken({
    _id: user._id,
    role: user.role,
    workspace: user.workspace,
  });
  const refreshToken = generateRefreshToken({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  // 5. Response bhejo
  const userResponse = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("workspace");

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: userResponse, workspace, accessToken },
        "Registration successful"
      )
    );
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = generateAccessToken({
    _id: user._id,
    role: user.role,
    workspace: user.workspace,
  });
  const refreshToken = generateRefreshToken({ _id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, { user, accessToken }, "Login successful")
    );
});

// REFRESH TOKEN
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "No refresh token");

  const decoded = verifyRefreshToken(incomingRefreshToken);
  const user = await User.findById(decoded._id);

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const accessToken = generateAccessToken({
    _id: user._id,
    role: user.role,
    workspace: user.workspace,
  });
  const newRefreshToken = generateRefreshToken({ _id: user._id });

  user.refreshToken = newRefreshToken;
  await user.save();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
});

// LOGOUT
export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out"));
});

// GET CURRENT USER
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("workspace");
  res.status(200).json(new ApiResponse(200, { user }, "User fetched"));
});