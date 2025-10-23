import express from "express";
import { deleteUser, getProfile, getUsers, login, register } from "../controllers/authController.js";
import { authMiddleWare, authorizeRoles } from "../Middleware/authMiddleware.js";


const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/profile", authMiddleWare, getProfile);
router.get("/users", authMiddleWare, authorizeRoles("admin"), getUsers);
router.delete("/users/:id", authMiddleWare, authorizeRoles("admin"), deleteUser);



export default router;