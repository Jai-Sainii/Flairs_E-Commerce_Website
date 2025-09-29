import express from "express"
import {getAllProducts, createProduct, getSingleProduct} from "../controllers/productController.js"

const router = express.Router()

router.get("/", getAllProducts)
router.post("/", createProduct)
router.get("/:id", getSingleProduct)

export default router