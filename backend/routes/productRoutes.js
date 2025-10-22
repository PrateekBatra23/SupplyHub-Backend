import { fetchProducts, addProduct, deleteProductById, updateProductById } from "../controllers/productController.js";

import express from "express";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/products", authMiddleWare, authorizeRoles("admin","retailer","warehouse_worker"), fetchProducts);
router.post("/products", authMiddleWare, authorizeRoles("admin"), addProduct);
router.put("/products/:id", authMiddleWare, authorizeRoles("admin"), updateProductById);
router.delete("/products/:id", authMiddleWare, authorizeRoles("admin"), deleteProductById);
export default router;
