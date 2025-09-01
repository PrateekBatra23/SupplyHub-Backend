import { fetchInventory, modifyInventory } from "../controllers/inventoryController.js";

import express from "express";
const router = express.Router();

router.get("/", fetchInventory);
router.post("/", modifyInventory);

export default router;
