import { Router } from "express";

import { authController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/authenticate";

import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from "../validators/authValidator";

const router = Router();

// Register
router.post("/register", validate(registerSchema), authController.register);

// Login
router.post("/login", validate(loginSchema), authController.login);

// Refresh access token
router.post("/refresh-token", authController.refreshToken);

// Get currently authenticated user
router.get("/me", authenticate, authController.getCurrentUser);

// Logout
router.post("/logout", authController.logout);

// Verify email
router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail,
);

// Resend verification email
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  authController.resendVerification,
);

export default router;
