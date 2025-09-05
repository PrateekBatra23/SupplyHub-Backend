import express from"express";
import { fetchShipment, createShipment } from "../controllers/shipmentController.js";
import { authMiddleWare } from "../Middleware/authMiddleware.js";

const router=express.Router();

router.get("/",authMiddleWare,fetchShipment);
router.post("/",authMiddleWare,createShipment);

export default router;