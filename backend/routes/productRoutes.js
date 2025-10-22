import { fetchProducts, addProduct, deleteProductById, updateProductById, lowStock } from "../controllers/productController.js";

import express from "express";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleWare, authorizeRoles("admin", "procurement_manager", "warehouse_manager"), fetchProducts);
router.post("/", authMiddleWare, authorizeRoles("admin", "procurement_manager"), addProduct);
router.put("/:id", authMiddleWare, authorizeRoles("admin", "procurement_manager"), updateProductById);
router.delete("/:id", authMiddleWare, authorizeRoles("admin"), deleteProductById);
router.get("/low-stock", authMiddleWare, authorizeRoles("admin", "warehouse_manager"), lowStock);
export default router;
