import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

// import authenticateToken from "../middleware/authMiddleware";
import validator from '../utils/validator';

import signup from '../controllers/userController/signup.controller';
import getMe from '../controllers/userController/getMe.controller';

import { userSchema, loginSchema } from '../middleware/joiValidation';
import login from "../controllers/userController/login.controller";
import authenticateToken from "../middleware/authMiddleware";
import getUserByUserId from "../controllers/userController/getUserByUserId.controller";

// Login route
router.post("/login", validator(loginSchema), login);

// Signup route
router.post("/signup", validator(userSchema), signup);

// // GetMe route
router.get("/getme", authenticateToken, getMe);

// // Get user by user ID route
router.get("/:user_id", getUserByUserId);

export default router; // Use ES module export