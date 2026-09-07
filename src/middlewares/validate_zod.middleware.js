import StatusCodes from "../constants/status_codes.js";
import ApiError from "../utils/api_error_handler.js";

const validate = (getSchema, type = "body", options = { required: true }) => {
  return (req, res, next) => {
    try {
      const data = req[type];

      // If required but missing → error
      if (options.required && (data === undefined || data === null)) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, `${type} is required`, [
            { field: "", message: `${type} is required` },
          ]),
        );
      }

      // If not required and missing → just skip validation
      if (!options.required && (data === undefined || data === null)) {
        return next();
      }

      getSchema.parse(data); // Zod throws error if invalid
      next();
    } catch (err) {
      const formatted = err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      // join all messages for ApiError.message
      const combinedMessage = formatted
        .map((f) => `${f.field}: ${f.message}`)
        .join("; ");

      // Passing error to global error handler
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          combinedMessage, // now actual Zod messages are in message
          formatted,
          err.stack,
        ),
      );
    }
  };
};

export default validate;
