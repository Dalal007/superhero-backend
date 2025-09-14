import Hero from "../models/Hero.js";

export const heroRepository = {
  async find(filter, options = {}) {
    const { sort = { name: 1 }, skip = 0, limit = 20 } = options;
    return Hero.find(filter).sort(sort).skip(skip).limit(Number(limit));
  },

  async count(filter) {
    return Hero.countDocuments(filter);
  },

  async findById(id) {
    return Hero.findById(id).populate('lastUpdatedBy', 'name email');
  },

  async updateById(id, updates) {
    return Hero.findByIdAndUpdate(id, updates, { new: true }).populate('lastUpdatedBy', 'name email');
  },

  async findManyByIds(ids) {
    return Hero.find({ _id: { $in: ids || [] } });
  },
};


