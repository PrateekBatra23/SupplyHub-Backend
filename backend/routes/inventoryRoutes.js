import { deleteInventoryById, fetchInventory, modifyInventory, updateInventoryById } from "../controllers/inventoryController.js";

import express from "express";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/inventory", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), fetchInventory);
router.post("/inventory", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), modifyInventory);
router.put("/inventory/:id", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), updateInventoryById);
router.delete("/inventory/:id", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), deleteInventoryById);

export default router;
