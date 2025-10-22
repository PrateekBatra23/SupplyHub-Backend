import express from "express";
import { login, register } from "../controllers/authController.js";
import { authMiddleWare } from "../Middleware/authMiddleware.js";
import { profile } from "console";

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile", authMiddleWare, profile);



export default router;