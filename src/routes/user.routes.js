import express from "express";

import validate from "../middlewares/validate_zod.middleware.js";
import { registerSchema } from "../validators/register.schema.js";
import { loginSchema } from "../validators/login.schema.js";

import { register, login } from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/v1/users/register
 * @access  Public
 */
router.route("/register").post(validate(registerSchema), register);

/**
 * @desc    Login user
 * @route   POST /api/v1/users/login
 * @access  Public
 */
router.route("/login").post(validate(loginSchema), login);




export default router;
