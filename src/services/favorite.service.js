import { userRepository } from "../repositories/user.repository.js";
import logger from "../lib/logger.js";

export const favoriteService = {
  async add(userId, heroId) {
    logger.debug(`Add favorite service - User: ${userId}, Hero: ${heroId}`);
    if (!heroId) {
      logger.warn(`Add favorite failed - Missing heroId for user: ${userId}`);
      return { error: { status: 400, message: "heroId required" } };
    }
    await userRepository.addFavorite(userId, heroId);
    logger.info(`Favorite added successfully - User: ${userId}, Hero: ${heroId}`);
    return { ok: true };
  },

  async remove(userId, heroId) {
    logger.debug(`Remove favorite service - User: ${userId}, Hero: ${heroId}`);
    await userRepository.removeFavorite(userId, heroId);
    logger.info(`Favorite removed successfully - User: ${userId}, Hero: ${heroId}`);
    return { ok: true };
  },

  async list(userId) {
    logger.debug(`List favorites service - User: ${userId}`);
    const user = await userRepository.findWithFavorites(userId);
    const favorites = user?.favorites || [];
    logger.debug(`Favorites list returned ${favorites.length} items for user: ${userId}`);
    return favorites;
  },
};


