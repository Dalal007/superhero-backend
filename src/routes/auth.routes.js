import { Router } from "express";
import { login, register, me } from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../middleware/validators.js";
import { requireAuth } from "../middleware/auth.js";
const r = Router();

r.post("/register", validateRegister, register);
r.post("/login", validateLogin, login);
r.get("/me", requireAuth(), me);

export default r;
