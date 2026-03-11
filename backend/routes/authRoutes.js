import express from "express";
import {
  signup,
  login,
  logout,
  me,
  protect,
  googleLogin,
  verifyOtp,
  resendOtp,
  forgotPassword,
  VerifyForgotPasswordOtp,
  resetPassword,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/google", googleLogin);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", VerifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);

export default router;
