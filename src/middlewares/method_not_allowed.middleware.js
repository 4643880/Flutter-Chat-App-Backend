import StatusCodes from "../constants/status_codes.js";

const methodNotAllowed = (req, res, _next) => {
  res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
    status: "failed",
    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
    message: `Method ${req.method} not allowed on this route`,
    hint: "Use POST for creating, PUT/PATCH for updating, GET for fetching, DELETE for deleting.",
  });
};

export default methodNotAllowed;
