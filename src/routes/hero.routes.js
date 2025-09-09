import { Router } from "express";
import {
  listHeroes,
  getHero,
  updateHero,
} from "../controllers/hero.controller.js";
import { requireAuth } from "../middleware/auth.js";
const r = Router();

r.get("/", listHeroes);
r.get("/:id", getHero);
r.patch("/:id", requireAuth("editor"), updateHero);

export default r;
