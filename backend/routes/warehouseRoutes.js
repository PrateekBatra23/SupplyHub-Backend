import express from "express";
import { fetchWarehouses, addWarehouse, deleteWarehouseById, updateWarehouseById } from "../controllers/warehouseController.js";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleWare, authorizeRoles("admin"), fetchWarehouses);
router.post("/", authMiddleWare, authorizeRoles("admin"), addWarehouse);
router.put("/:id", authMiddleWare, authorizeRoles("admin"), updateWarehouseById);
router.delete("/:id", authMiddleWare, authorizeRoles("admin"), deleteWarehouseById);

export default router;









