import express from"express";
import { fetchShipment, createShipment } from "../controllers/shipmentController.js";

const router=express.Router();

router.get("/",fetchShipment);
router.post("/",createShipment);

export default router;