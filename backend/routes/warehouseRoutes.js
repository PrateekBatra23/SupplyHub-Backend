import express from "express";
import { fetchWarehouses, addWarehouse, deleteWarehouseById, updateWarehouseById } from "../controllers/warehouseController.js";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/warehouses", authMiddleWare, authorizeRoles("admin"), fetchWarehouses);
router.post("/warehouses", authMiddleWare, authorizeRoles("admin"), addWarehouse);
router.put("/warehouses/:id", authMiddleWare, authorizeRoles("admin"), updateWarehouseById);
router.delete("/warehouses/:id", authMiddleWare, authorizeRoles("admin"), deleteWarehouseById);

export default router;









