import { fetchProducts, addProduct } from "../controllers/productController.js";

import express from "express";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleWare,fetchProducts);
router.post("/",authMiddleWare, addProduct);

export default router;
