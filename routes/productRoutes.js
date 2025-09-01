import { fetchProducts, addProduct } from "../controllers/productController.js";

import express from "express";
const router = express.Router();

router.get("/", fetchProducts);
router.post("/", addProduct);

export default router;
