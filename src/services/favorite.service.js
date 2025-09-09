import { userRepository } from "../repositories/user.repository.js";

export const favoriteService = {
  async add(userId, heroId) {
    if (!heroId) return { error: { status: 400, message: "heroId required" } };
    await userRepository.addFavorite(userId, heroId);
    return { ok: true };
  },

  async remove(userId, heroId) {
    await userRepository.removeFavorite(userId, heroId);
    return { ok: true };
  },

  async list(userId) {
    const user = await userRepository.findWithFavorites(userId);
    return user?.favorites || [];
  },
};


