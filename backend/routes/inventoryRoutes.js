import { addInventory, deleteInventory, getInventory,updateInventory} from "../controllers/inventoryController.js";

import express from "express";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), getInventory);
router.post("/", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), addInventory);
router.put("/:id", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), updateInventory);
router.delete("/:id", authMiddleWare, authorizeRoles("admin", "warehouse_worker"), deleteInventory);

export default router;
