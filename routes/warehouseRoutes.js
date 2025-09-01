import express from "express";
import { fetchWarehouses, addWarehouse } from "../controllers/warehouseController.js";

const router = express.Router();

router.get("/", fetchWarehouses);
router.post("/", addWarehouse);

export default router;









