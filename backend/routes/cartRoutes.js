import express from "express";
import { protect } from "../middlewares/authMiddleware.js"; 
import { getCart, addItemToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);

router.post("/add", protect, addItemToCart);

router.put("/update/:productId", protect, updateCartItem);

router.delete("/remove/:productId", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

export default router;
