import express from "express";

import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";
import { createVendor, deleteVendor, getVendors, updateVendor } from "../controllers/vendorController.js";
const router = express.Router();

router.get("/", authMiddleWare, authorizeRoles("admin", "procurement_manager"), getVendors);
router.post("/", authMiddleWare, authorizeRoles("admin", "procurement_manager"), createVendor);
router.put("/:id", authMiddleWare, authorizeRoles("admin", "procurement_manager"), updateVendor);
router.delete("/:id", authMiddleWare, authorizeRoles("admin"), deleteVendor);

export default router;
