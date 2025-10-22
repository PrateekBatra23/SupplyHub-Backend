import express from"express";
import { fetchShipment, createShipment, deleteShipmentById, updateShipmentById } from "../controllers/shipmentController.js";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";

const router=express.Router();

router.get("/", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), fetchShipment);
router.post("/", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), createShipment);
router.put("/:id", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), updateShipmentById);
router.delete("/:id", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), deleteShipmentById);

export default router;