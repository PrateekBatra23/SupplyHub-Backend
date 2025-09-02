import { fetchOrder,createOrder } from "../controllers/orderController.js";

import express from "express";
const router = express.Router();


router.get('/',fetchOrder);
router.post('/',createOrder);

export default router;