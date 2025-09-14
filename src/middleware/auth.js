import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../lib/logger.js";

export function requireAuth(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const hdr = req.headers.authorization || "";
      const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
      if (!token) {
        logger.warn(`Authentication failed - Missing token for ${req.method} ${req.path}`);
        return res.status(401).json({ message: "Missing token" });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub);
      if (!user) {
        logger.warn(`Authentication failed - User not found for token`);
        return res.status(401).json({ message: "User not found" });
      }

      if (requiredRole) {
        const ranks = { viewer: 1, editor: 2, admin: 3 };
        if (ranks[user.role] < ranks[requiredRole]) {
          logger.warn(`Authorization failed - User ${user.email} (${user.role}) insufficient role for ${requiredRole}`);
          return res.status(403).json({ message: "Insufficient role" });
        }
      }
      
      logger.debug(`Authentication successful - User: ${user.email}, Role: ${user.role}, Required: ${requiredRole || 'none'}`);
      req.user = user;
      next();
    } catch (error) {
      logger.warn(`Authentication failed - Invalid token for ${req.method} ${req.path}`, error.message);
      res.status(401).json({ message: "Invalid token" });
    }
  };
}
