import { heroService } from "../services/hero.service.js";

export async function listHeroes(req, res) {
  const { q, page = 1, limit = 20 } = req.query;
  const data = await heroService.list({ q, page: Number(page), limit: Number(limit) });
  res.json(data);
}

export async function getHero(req, res) {
  const hero = await heroService.getById(req.params.id);
  if (!hero) return res.status(404).json({ message: "Hero not found" });
  res.json(hero);
}

// Role-based update (editors/admins)
export async function updateHero(req, res) {
  try {
    const updates = req.body || {};
    console.log("Received update request for hero:", req.params.id);
    console.log("Update data:", updates);
    console.log("User ID:", req.user._id);
    
    const hero = await heroService.update(req.params.id, updates, req.user._id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });
    
    console.log("Updated hero:", hero);
    res.json(hero);
  } catch (error) {
    console.error("Error updating hero:", error);
    if (error.message.includes("Invalid") || error.message.includes("must be")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error updating hero", error: error.message });
  }
}
