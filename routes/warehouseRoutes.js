import express from "express";
import { fetchWarehouses, addWarehouse } from "../controllers/warehouseController.js";
import { authMiddleWare } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleWare, fetchWarehouses);
router.post("/",authMiddleWare, addWarehouse);

export default router;









