import StatusCodes from "../constants/status_codes.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/api_error_handler.js";

const register = async (username, password, lastSeen) => {

  const existingUser = await userRepository.findByUserName(username);

  if (existingUser) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "User already exists with given email.",
    );
  }

  console.log('11');
  const myUser = await userRepository.createUser({
    username,
    password,
    lastSeen,
  });

  console.log('22')
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    myUser._id,
  );

  console.log('33')

  // Remove Password
  const createdUser = await userRepository.findUserById(myUser._id);

  console.log('44')
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
    console.log('1');
    const user = await userRepository.findUserById(getUserId);
    console.log('2');
    // @ts-ignore
    const accessToken = user.generateAccessToken();
    console.log('3');
    // @ts-ignore
    const refreshToken = user.generateRefreshToken();
    console.log('4');

    user.refreshToken = refreshToken;
    console.log('5')
    await user.save({ validateBeforeSave: false });
    console.log('6')

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
