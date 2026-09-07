import User from "../models/user.model.js";

const createUser = async (data) => {
  return await User.create(data);
};

const findByUserName = async (getUsername) => {
  return await User.findOne({
    username: getUsername,
  });
};

const findUserById = async (id) => {
  return await User.findById(id).select("-password -__v -refreshToken");
};

const findExistingUserById = async (id) => {
  return await User.findById(id).select("-password -__v -refreshToken");
};

export default {
  createUser,
  findByUserName,
  findUserById,
  findExistingUserById,
};
