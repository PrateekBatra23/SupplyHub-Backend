import { fetchOrder,createOrder, fetchOrderById, deleteOrderById, updateOrderById } from "../controllers/orderController.js";

import express from "express";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
const router = express.Router();


router.get("/orders", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), fetchOrder);
router.get("/orders/:id", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), fetchOrderById);
router.post("/orders", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), createOrder);
router.put("/orders/:id", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), updateOrderById);
router.delete("/orders/:id", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), deleteOrderById);


export default router;