import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../config/env.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [128, "Password cannot exceed 128 characters"],
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

//  Using pre hook of the mongoose which will call before saving, only if the password is modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Designing Custom Method and injecting it to compare password
userSchema.methods.isMyPasswordCorrect = async function (getPassword) {
  let result = await bcrypt.compare(getPassword, this.password);
  return result;
};

// Implementing Custom Method to generate Access Token
userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  return accessToken;
};

// Implementing Custom Method to generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
    username: this.username,
  };

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  return refreshToken;
};

const User = mongoose.model("User", userSchema);

export default User;
