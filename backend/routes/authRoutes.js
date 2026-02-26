import express from "express";
import {
  signup,
  login,
  logout,
  me,
  protect,
  googleLogin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/google", googleLogin);

export default router;
