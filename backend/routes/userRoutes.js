import express from "express"
import { singleUser } from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, singleUser)

export default router;