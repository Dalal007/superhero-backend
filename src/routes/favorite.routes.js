import { Router } from "express";
import {
  addFavorite,
  removeFavorite,
  listFavorites,
} from "../controllers/favorite.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.get("/", requireAuth(), listFavorites);
r.post("/", requireAuth(), addFavorite);
r.delete("/:heroId", requireAuth(), removeFavorite);

export default r;
