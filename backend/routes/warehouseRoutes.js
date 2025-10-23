import express from "express";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";
import { createWarehouse, deleteWarehouse, getWarehouses, updateWarehouse } from "../controllers/warehouseController.js";

const router = express.Router();

router.get("/", authMiddleWare, authorizeRoles("admin"), getWarehouses);
router.post("/", authMiddleWare, authorizeRoles("admin"), createWarehouse);
router.put("/:id", authMiddleWare, authorizeRoles("admin"), updateWarehouse);
router.delete("/:id", authMiddleWare, authorizeRoles("admin"), deleteWarehouse);

export default router;









