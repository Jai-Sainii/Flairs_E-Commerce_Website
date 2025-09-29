import express from "express"
import { getAllUser, createUser, updateUser, singleUser, deleteUser } from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",protect, getAllUser)
router.get("/:id", singleUser)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router;