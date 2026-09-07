import ApiResponse from "../utils/api_response_handler.js";
import asyncHandler from "../utils/async_handler.js";
import StatusCodes from "../constants/status_codes.js";
import userService from "../services/user.service.js";

const register = asyncHandler(async (req, res) => {
  const { username, password, lastSeen } = req.body;

  const { user, accessToken, refreshToken } = await userService.register(
    username,
    password,
    lastSeen,
  );

  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        { user, accessToken, refreshToken },
        "success",
        "User registered successfully.",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { user, accessToken, refreshToken } = await userService.login(
    username,
    password,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        { user, accessToken, refreshToken },
        "success",
        "User logged in successfully.",
      ),
    );
});

export { register, login };
