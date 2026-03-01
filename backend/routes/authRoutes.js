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
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/google", googleLogin);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
