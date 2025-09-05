import { fetchInventory, modifyInventory } from "../controllers/inventoryController.js";

import express from "express";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.get("/",authMiddleWare,fetchInventory);
router.post("/",authMiddleWare,modifyInventory);

export default router;
