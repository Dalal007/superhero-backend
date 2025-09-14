import { heroRepository } from "../repositories/hero.repository.js";
import { appCache } from "../lib/cache.js";
import logger from "../lib/logger.js";

export const heroService = {
  async list({ q, page = 1, limit = 20 }) {
    logger.debug(`Hero list service - Query: ${q || 'none'}, Page: ${page}, Limit: ${limit}`);
    const filter = q ? { name: new RegExp(q, "i") } : {};
    const [items, total] = await Promise.all([
      heroRepository.find(filter, { sort: { name: 1 }, skip: (page - 1) * limit, limit }),
      heroRepository.count(filter),
    ]);
    logger.debug(`Hero list service returned ${items.length} items out of ${total} total`);
    return { items, total };
  },

  async getById(id) {
    const key = `hero:${id}`;
    const cached = appCache.get(key);
    if (cached) {
      logger.debug(`Hero cache hit for ID: ${id}`);
      return cached;
    }
    logger.debug(`Hero cache miss for ID: ${id}, fetching from database`);
    const hero = await heroRepository.findById(id);
    if (hero) {
      appCache.set(key, hero);
      logger.debug(`Hero cached for ID: ${id}`);
    }
    return hero;
  },

  async update(id, updates, userId) {
    logger.debug(`Hero update service - ID: ${id}, User: ${userId}, Updates: ${Object.keys(updates).join(', ')}`);
    
    const allowed = ["name", "powerstats", "biography", "appearance", "work", "connections", "imageUrl"];
    
    // Filter allowed fields
    const filteredUpdates = {};
    for (const k of Object.keys(updates)) {
      if (allowed.includes(k)) {
        filteredUpdates[k] = updates[k];
      }
    }
    
    // Validate powerstats if provided
    if (filteredUpdates.powerstats) {
      const powerstats = filteredUpdates.powerstats;
      const validStats = ["intelligence", "strength", "speed", "durability", "power", "combat"];
      
      for (const [key, value] of Object.entries(powerstats)) {
        if (validStats.includes(key)) {
          const numValue = parseInt(value);
          if (isNaN(numValue) || numValue < 0 || numValue > 100) {
            throw new Error(`Invalid powerstat value for ${key}: must be between 0 and 100`);
          }
          filteredUpdates.powerstats[key] = numValue;
        }
      }
    }
    
    // Validate name if provided
    if (filteredUpdates.name && (!filteredUpdates.name.trim() || filteredUpdates.name.length > 100)) {
      throw new Error("Name must be between 1 and 100 characters");
    }
    
    // Validate imageUrl if provided
    if (filteredUpdates.imageUrl && filteredUpdates.imageUrl.length > 500) {
      throw new Error("Image URL must be less than 500 characters");
    }
    
    // Add last updated fields
    filteredUpdates.lastUpdatedBy = userId;
    filteredUpdates.lastUpdatedAt = new Date();
    
    // Update the hero and invalidate cache
    const updatedHero = await heroRepository.updateById(id, filteredUpdates);
    
    // Invalidate cache for this hero
    const key = `hero:${id}`;
    appCache.del(key);
    logger.debug(`Hero cache invalidated for ID: ${id}`);
    
    logger.info(`Hero updated successfully - ID: ${id}, Name: ${updatedHero?.name}`);
    return updatedHero;
  },
};


