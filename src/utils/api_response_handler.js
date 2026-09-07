class ApiResponse {
  constructor(statusCode, data, status = "success", message) {
    this.status = status;
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
