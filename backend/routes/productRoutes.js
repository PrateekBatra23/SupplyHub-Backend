import { fetchProducts, addProduct, deleteProductById } from "../controllers/productController.js";

import express from "express";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/products", authMiddleWare, authorizeRoles("admin","retailer","warehouse_worker"), fetchProducts);
router.post("/products", authMiddleware, authorizeRoles("admin"), addProduct);
router.put("/products/:id", authMiddleware, authorizeRoles("admin"), updateProductById);
router.delete("/products/:id", authMiddleware, authorizeRoles("admin"), deleteProductById);
export default router;
