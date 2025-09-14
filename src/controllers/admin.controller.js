import User from "../models/User.js";
import logger from "../lib/logger.js";

export async function getUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const role = req.query.role || "";
    
    logger.info(`Admin users list request - Page: ${page}, Limit: ${limit}, Search: ${search}, Role: ${role}, SortBy: ${sortBy}`);
    
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    // Role filter
    if (role) {
      filter.role = role;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    const users = await User.find(filter, { passwordHash: 0 })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    logger.info(`Admin users list returned ${users.length} users out of ${total} total`);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        search,
        sortBy,
        sortOrder,
        role,
      },
    });
  } catch (error) {
    logger.error("Error fetching users list", error.message);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    logger.info(`Admin role update request - Target User ID: ${userId}, New Role: ${role}, Admin: ${req.user.email}`);

    if (!["viewer", "editor", "admin"].includes(role)) {
      logger.warn(`Invalid role provided: ${role}`);
      return res.status(400).json({ message: "Invalid role" });
    }

    // Prevent admin from changing their own role
    if (userId === req.user._id.toString() && role !== "admin") {
      logger.warn(`Admin ${req.user.email} attempted to change their own role`);
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: "-passwordHash" }
    );

    if (!user) {
      logger.warn(`User not found for role update: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User role updated successfully - User: ${user.email}, New Role: ${role}, Admin: ${req.user.email}`);
    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    logger.error(`Error updating user role - User ID: ${req.params.userId}`, error.message);
    res.status(500).json({ message: "Error updating user role", error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    logger.info(`Admin user deletion request - Target User ID: ${userId}, Admin: ${req.user.email}`);

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      logger.warn(`Admin ${req.user.email} attempted to delete their own account`);
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      logger.warn(`User not found for deletion: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User deleted successfully - User: ${user.email}, Admin: ${req.user.email}`);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user - User ID: ${req.params.userId}`, error.message);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
}
