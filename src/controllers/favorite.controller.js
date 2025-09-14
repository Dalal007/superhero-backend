import { favoriteService } from "../services/favorite.service.js";
import logger from "../lib/logger.js";

export async function addFavorite(req, res) {
  try {
    const { heroId } = req.body;
    const userId = req.user._id;
    logger.info(`Add favorite request - User: ${req.user.email}, Hero ID: ${heroId}`);
    const result = await favoriteService.add(userId, heroId);
    if (result.error) {
      logger.warn(`Add favorite failed - User: ${req.user.email}, Hero ID: ${heroId} - ${result.error.message}`);
      return res.status(result.error.status).json(result.error);
    }
    logger.info(`Favorite added successfully - User: ${req.user.email}, Hero ID: ${heroId}`);
    res.json(result);
  } catch (error) {
    logger.error(`Add favorite error - User: ${req.user?.email}, Hero ID: ${req.body.heroId}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeFavorite(req, res) {
  try {
    const heroId = req.params.heroId;
    const userId = req.user._id;
    logger.info(`Remove favorite request - User: ${req.user.email}, Hero ID: ${heroId}`);
    const result = await favoriteService.remove(userId, heroId);
    if (result.error) {
      logger.warn(`Remove favorite failed - User: ${req.user.email}, Hero ID: ${heroId} - ${result.error.message}`);
      return res.status(result.error.status).json(result.error);
    }
    logger.info(`Favorite removed successfully - User: ${req.user.email}, Hero ID: ${heroId}`);
    res.json(result);
  } catch (error) {
    logger.error(`Remove favorite error - User: ${req.user?.email}, Hero ID: ${req.params.heroId}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function listFavorites(req, res) {
  try {
    const userId = req.user._id;
    logger.info(`List favorites request - User: ${req.user.email}`);
    const items = await favoriteService.list(userId);
    logger.info(`Favorites list returned ${items.length} items for user: ${req.user.email}`);
    res.json(items);
  } catch (error) {
    logger.error(`List favorites error - User: ${req.user?.email}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
