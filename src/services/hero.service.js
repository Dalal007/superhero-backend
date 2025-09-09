import { heroRepository } from "../repositories/hero.repository.js";
import { appCache } from "../lib/cache.js";

export const heroService = {
  async list({ q, page = 1, limit = 20 }) {
    const filter = q ? { name: new RegExp(q, "i") } : {};
    const [items, total] = await Promise.all([
      heroRepository.find(filter, { sort: { name: 1 }, skip: (page - 1) * limit, limit }),
      heroRepository.count(filter),
    ]);
    return { items, total };
  },

  async getById(id) {
    const key = `hero:${id}`;
    const cached = appCache.get(key);
    if (cached) return cached;
    const hero = await heroRepository.findById(id);
    if (hero) appCache.set(key, hero);
    return hero;
  },

  async update(id, updates) {
    const allowed = ["name", "powerstats", "biography", "appearance", "work", "connections", "imageUrl"];
    for (const k of Object.keys(updates)) {
      if (!allowed.includes(k)) delete updates[k];
    }
    return heroRepository.updateById(id, updates);
  },
};


