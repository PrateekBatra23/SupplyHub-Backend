import { fetchOrder,createOrder, fetchOrderById, deleteOrderById, updateOrderById } from "../controllers/orderController.js";

import express from "express";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";
const router = express.Router();


router.get("/", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), fetchOrder);
router.get("/:id", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), fetchOrderById);
router.post("/", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), createOrder);
router.put("/:id", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), updateOrderById);
router.delete("/:id", authMiddleWare, authorizeRoles("admin", "retailer", "warehouse_worker"), deleteOrderById);


export default router;