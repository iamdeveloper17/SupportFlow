import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const errors = error.errors?.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    next(new ApiError(400, "Validation failed", errors));
  }
};