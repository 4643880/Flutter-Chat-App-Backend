import StatusCodes from "../constants/status_codes.js";

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // console.log("debug1: ", error);
      // console.log("debug2: ", error.name);
      // console.log("debug3: ", error.message);

      let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      let message = error.message;

      // Mongoose validation error
      if (error.name === "ValidationError") {
        statusCode = StatusCodes.BAD_REQUEST;
        message = Object.values(error.errors)
          .map((err) => err.message)
          .join(", ");
      }

      // Duplicate key error (unique constraint)
      if (error.code && error.code === 11000) {
        statusCode = StatusCodes.CONFLICT;
        message = `Duplicate field value entered: ${Object.keys(error.keyValue).join(", ")}`;
      }

      return res.status(statusCode).json({
        success: false,
        message,
      });
    }
  };
};

export default asyncHandler;
