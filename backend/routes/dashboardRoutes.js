import express from "express";
import { getDashboardKPIs } from "../controllers/dashboardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/kpis", verifyToken, getDashboardKPIs);

export default router;
