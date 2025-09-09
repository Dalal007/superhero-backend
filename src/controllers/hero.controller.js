import { heroService } from "../services/hero.service.js";

export async function listHeroes(req, res) {
  const { q, page = 1, limit = 20 } = req.query;
  const data = await heroService.list({ q, page: Number(page), limit: Number(limit) });
  res.json(data);
}

export async function getHero(req, res) {
  const hero = await heroService.getById(req.params.id);
  if (!hero) return res.status(404).json({ message: "Not found" });
  res.json(hero);
}

// Role-based update (editors/admins)
export async function updateHero(req, res) {
  const updates = req.body || {};
  const hero = await heroService.update(req.params.id, updates);
  if (!hero) return res.status(404).json({ message: "Not found" });
  res.json(hero);
}
