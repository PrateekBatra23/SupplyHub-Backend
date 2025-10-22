import express from "express";
import { fetchWarehouses, addWarehouse, deleteWarehouseById, updateWarehouseById } from "../controllers/warehouseController.js";
import { authMiddleWare } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/warehouses", authMiddleware, authorizeRoles("admin"), fetchWarehouses);
router.post("/warehouses", authMiddleware, authorizeRoles("admin"), addWarehouse);
router.put("/warehouses/:id", authMiddleware, authorizeRoles("admin"), updateWarehouseById);
router.delete("/warehouses/:id", authMiddleware, authorizeRoles("admin"), deleteWarehouseById);

export default router;









