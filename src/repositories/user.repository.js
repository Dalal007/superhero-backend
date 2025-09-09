import User from "../models/User.js";

export const userRepository = {
  async findByEmail(email) {
    return User.findOne({ email });
  },

  async findById(id) {
    return User.findById(id);
  },

  async create(data) {
    const user = new User(data);
    return user;
  },

  async save(user) {
    return user.save();
  },

  async addFavorite(userId, heroId) {
    return User.findByIdAndUpdate(userId, { $addToSet: { favorites: heroId } }, { new: true });
  },

  async removeFavorite(userId, heroId) {
    return User.findByIdAndUpdate(userId, { $pull: { favorites: heroId } }, { new: true });
  },

  async findWithFavorites(userId) {
    return User.findById(userId).populate("favorites");
  },
};


