import express from "express";
import { subscribeToNewsletter } from "../controllers/newsLetterController.js";

const router = express.Router();

router.post("/subscribe", subscribeToNewsletter);

export default router;