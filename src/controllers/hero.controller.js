import { heroService } from "../services/hero.service.js";
import logger from "../lib/logger.js";

export async function listHeroes(req, res) {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    logger.info(`Heroes list request - Query: ${q || 'none'}, Page: ${page}, Limit: ${limit}`);
    const data = await heroService.list({ q, page: Number(page), limit: Number(limit) });
    logger.info(`Heroes list returned ${data.items.length} heroes out of ${data.total} total`);
    res.json(data);
  } catch (error) {
    logger.error("Error fetching heroes list", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getHero(req, res) {
  try {
    const heroId = req.params.id;
    logger.info(`Hero details request for ID: ${heroId}`);
    const hero = await heroService.getById(heroId);
    if (!hero) {
      logger.warn(`Hero not found for ID: ${heroId}`);
      return res.status(404).json({ message: "Hero not found" });
    }
    logger.info(`Hero details returned for: ${hero.name}`);
    res.json(hero);
  } catch (error) {
    logger.error(`Error fetching hero with ID: ${req.params.id}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Role-based update (editors/admins)
export async function updateHero(req, res) {
  try {
    const heroId = req.params.id;
    const updates = req.body || {};
    const userId = req.user._id;
    
    logger.info(`Hero update request for ID: ${heroId} by user: ${req.user.email}`);
    logger.debug(`Update data: ${JSON.stringify(updates)}`);
    
    const hero = await heroService.update(heroId, updates, userId);
    if (!hero) {
      logger.warn(`Hero not found for update ID: ${heroId}`);
      return res.status(404).json({ message: "Hero not found" });
    }
    
    logger.info(`Hero updated successfully: ${hero.name} by user: ${req.user.email}`);
    res.json(hero);
  } catch (error) {
    logger.error(`Hero update error for ID: ${req.params.id}`, error.message);
    if (error.message.includes("Invalid") || error.message.includes("must be")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error updating hero", error: error.message });
  }
}
