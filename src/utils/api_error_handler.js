class ApiError extends Error {
  constructor(
    myStatusCode,
    myMessage = "Something Went Wrong",
    myErrors = [],
    myStackTrace = "",
  ) {
    super(myMessage);
    this.statusCode = myStatusCode;
    this.message = myMessage;
    this.stacktrace = myStackTrace;
    this.errors = myErrors;

    this.name = this.constructor.name; // now e.name will be ApiError instead of Error
  }
}

export default ApiError;
