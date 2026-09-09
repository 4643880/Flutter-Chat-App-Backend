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
  return await User.findById(id);
};

const findExistingUserById = async (id) => {
  return await User.findById(id).select("-password -__v -refreshToken");
};

const getUserLastSeen = async (userId) => {
  // User ki sirf lastSeen value database se fetch karenge
  return await User.findById(userId).select("lastSeen");
};

const updateUserLastSeen = async (userId) => {
  // User ki lastSeen date ko current time par update karenge
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        lastSeen: new Date(),
      },
    },
    {
      new: true,
    },
  );
};

const updateUserOnlineStatus = async (userId, isOnline) => {
  // User ka online/offline status update karenge
  return await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isOnline,
      },
    },
    {
      new: true,
    },
  ).select("-password -__v -refreshToken");
};

const getUserOnlineStatus = async (userId) => {
  // User ka online status aur lastSeen fetch karenge
  return await User.findById(userId).select("isOnline lastSeen");
};

export default {
  createUser,
  findByUserName,
  findUserById,
  findExistingUserById,
  getUserLastSeen,
  updateUserLastSeen,
  updateUserOnlineStatus,
  getUserOnlineStatus,
};
