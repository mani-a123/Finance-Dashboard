import express from "express";
import { predictExpenses } from "../controllers/predictionController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, predictExpenses);

export default router;
