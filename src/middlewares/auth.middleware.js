
import { ACCESS_TOKEN_SECRET } from '../config/env.js';
import StatusCodes from '../constants/status_codes.js';
import userRepository from '../repositories/user.repository.js';
import ApiError from '../utils/api_error_handler.js';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/api_response_handler.js';

const verifyJwtMiddleware = async (req, res, next) => {
  try {
    const token =
      req.header('Authorization')?.replace('Bearer ', '') ||
      req?.cookies?.accessToken;

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized Request...');
    }

    const decodedInfo = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // @ts-ignore
    const user = await userRepository.findUserById(decodedInfo._id);

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Access Token...');
    }

    req.user = user; // Accessing this in the getUserProfile & logout function etc
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const response = new ApiResponse(
        StatusCodes.UNAUTHORIZED,
        null, // data
        'failed', // status
        'JWT token expired.' //
      );
      return res.status(StatusCodes.UNAUTHORIZED).json(response);
    } else {
      const response = new ApiResponse(
        StatusCodes.UNAUTHORIZED,
        null, // data
        'failed', // status
        error.message || 'Invalid access token.'
      );
      return res.status(StatusCodes.UNAUTHORIZED).json(response);
    }
  }
};

export default verifyJwtMiddleware;
