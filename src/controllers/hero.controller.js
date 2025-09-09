import Hero from "../models/Hero.js";
import { appCache } from "../lib/cache.js";

export async function listHeroes(req, res) {
  const { q, page = 1, limit = 20 } = req.query;
  const filter = q ? { name: new RegExp(q, "i") } : {};
  const [items, total] = await Promise.all([
    Hero.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Hero.countDocuments(filter),
  ]);
  res.json({ items, total });
}

export async function getHero(req, res) {
  const key = `hero:${req.params.id}`;
  const cached = appCache.get(key);
  if (cached) return res.json(cached);

  const hero = await Hero.findById(req.params.id);
  if (!hero) return res.status(404).json({ message: "Not found" });
  appCache.set(key, hero);
  res.json(hero);
}

// Role-based update (editors/admins)
export async function updateHero(req, res) {
  const updates = req.body || {};
  const allowed = [
    "name",
    "powerstats",
    "biography",
    "appearance",
    "work",
    "connections",
    "imageUrl",
  ];
  for (const k of Object.keys(updates)) {
    if (!allowed.includes(k)) delete updates[k];
  }
  const hero = await Hero.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  });
  if (!hero) return res.status(404).json({ message: "Not found" });
  res.json(hero);
}
