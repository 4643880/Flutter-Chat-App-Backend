import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Designing Custom Method and injecting it to compare password
userSchema.methods.isMyPasswordCorrect = async function (getPassword) {
  let result = await bcrypt.compare(getPassword, this.password);
  return result;
};

userSchema.methods.findByUserName = async function (getUserName) {
  let result = await bcrypt.compare(getUserName, this.username);
  return result;
};

// Implementing Custom Method to generate Access Token
userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    username: this.username,
  };

  // @ts-ignore
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  return accessToken;
};

// Implementing Custom Method to generate Access Token
userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    username: this.username,
  };

  // @ts-ignore
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return refreshToken;
};

const User = mongoose.model("User", userSchema);

export default User;
