import { Router } from "express";
import { recommend, compare } from "../controllers/team.controller.js";
import { requireAuth } from "../middleware/auth.js";
const r = Router();

r.get("/recommend", recommend);
r.post("/compare", requireAuth(), compare);

export default r;
