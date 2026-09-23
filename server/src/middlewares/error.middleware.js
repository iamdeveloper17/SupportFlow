import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  // 🔥 ALWAYS log the full error
  console.error("═══════════════════════════════════════");
  console.error("❌ ERROR CAUGHT:");
  console.error("   Message:", err.message);
  console.error("   Name:", err.name);
  console.error("   Stack:", err.stack);
  if (err.errors) console.error("   Errors:", err.errors);
  if (err.code) console.error("   Code:", err.code);
  console.error("═══════════════════════════════════════");

  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || []);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      originalError: err.message,
      errorName: err.name,
      mongoCode: err.code,
    }),
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;