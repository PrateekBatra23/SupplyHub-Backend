import { fetchOrder,createOrder, fetchOrderById } from "../controllers/orderController.js";

import express from "express";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
const router = express.Router();


router.get('/',authMiddleWare,fetchOrder);
router.get("/:id",authMiddleWare,fetchOrderById);

router.post('/',authMiddleWare,createOrder);

export default router;