import express from"express";
import { fetchShipment, createShipment, deleteShipmentById, updateShipmentById } from "../controllers/shipmentController.js";
import { authMiddleWare } from "../Middleware/authMiddleware.js";

const router=express.Router();

router.get("/shipments", authMiddleware, authorizeRoles("admin", "warehouse_worker"), fetchShipment);
router.post("/shipments", authMiddleware, authorizeRoles("admin", "warehouse_worker"), createShipment);
router.put("/shipments/:id", authMiddleware, authorizeRoles("admin", "warehouse_worker"), updateShipmentById);
router.delete("/shipments/:id", authMiddleware, authorizeRoles("admin", "warehouse_worker"), deleteShipmentById);

export default router;