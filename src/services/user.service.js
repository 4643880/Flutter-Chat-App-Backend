import StatusCodes from "../constants/status_codes.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/api_error_handler.js";

const register = async (username, password, lastSeen) => {
  console.log("asad");
  const existingUser = await userRepository.findByUserName(username);

  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "User already exists with given email.",
    );
  }

  const myUser = await userRepository.createUser({
    username,
    password,
    lastSeen,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    myUser._id,
  );

  // Remove Password
  const createdUser = await userRepository.findUserById(myUser._id);

  if (!createdUser) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong while registering the user",
    );
  }

  return { user: createdUser, accessToken, refreshToken };
};

const login = async (username, password) => {
  const user = await userRepository.findByUserName(username);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist!");
  }

  // @ts-ignore
  const isPasswordValid = await user.isMyPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid user credentials!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await userRepository.findExistingUserById(user._id);

  return { user: loggedInUser, accessToken, refreshToken };
};

const generateAccessAndRefreshTokens = async (getUserId) => {
  try {
    const user = await userRepository.findUserById(getUserId);
    // @ts-ignore
    const accessToken = user.generateAccessToken();
    // @ts-ignore
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Some went wrong while generating refresh & access tokens",
    );
  }
};

export default {
  register,
  login,
};
