import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getUsers, updateUserRole, deleteUser } from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes require admin role
router.use(requireAuth("admin"));

router.get("/users", getUsers);
router.patch("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

export default router;
