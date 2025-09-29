import express from "express"
import {getAllContactInfo, createContactInfo, getSingleContactInfo} from "../controllers/contactController.js"

const router = express.Router()

router.get("/", getAllContactInfo)
router.post("/", createContactInfo)
router.get("/:id", getSingleContactInfo)

export default router