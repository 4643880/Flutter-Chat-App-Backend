export default function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    status: statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stacktrace }),
  });
}