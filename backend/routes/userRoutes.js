import express from "express"
import { getAllUser, createUser, updateUser, singleUser, deleteUser } from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllUser)
router.get("/profile", protect, singleUser)
router.post("/", createUser)
router.put("/update/:id", protect, updateUser)
router.delete("/delete/:id", protect, deleteUser)

export default router;