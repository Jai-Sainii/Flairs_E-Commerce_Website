import express from "express"
import {createContactInfo} from "../controllers/contactController.js"

const router = express.Router()

router.post("/", createContactInfo)

export default router