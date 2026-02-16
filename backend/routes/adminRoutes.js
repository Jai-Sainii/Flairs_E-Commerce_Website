import express from "express";
import { registerAdmin, loginAdmin, addProduct, editProduct, deleteProduct, getAllOrders, updateOrderStatus, deleteOrder, getAllContactInfo, logoutAdmin, me, protectAdmin, getAllProducts } from "../controllers/adminController.js";

const router = express.Router();

// router.post("/adminRegister", registerAdmin);
router.post("/adminLogin", loginAdmin);
router.get("/getAllProducts", protectAdmin, getAllProducts);
router.post("/addProduct", protectAdmin, addProduct);
router.put("/editProduct/:id", protectAdmin, editProduct);
router.delete("/deleteProduct/:id", protectAdmin, deleteProduct);
router.get("/getAllOrders", protectAdmin, getAllOrders);
router.put("/updateOrderStatus/:id", protectAdmin, updateOrderStatus);
router.delete("/deleteOrder/:id", protectAdmin, deleteOrder);
router.get("/getAllContactInfo", protectAdmin, getAllContactInfo);
router.post("/adminLogout", protectAdmin, logoutAdmin);
router.get("/me", protectAdmin, me);

export default router;
