import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function requireAuth(requiredRole = null) {
  return async (req, res, next) => {
    try {
      const hdr = req.headers.authorization || "";
      const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Missing token" });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub);
      if (!user) return res.status(401).json({ message: "User not found" });

      if (requiredRole) {
        const ranks = { viewer: 1, editor: 2, admin: 3 };
        if (ranks[user.role] < ranks[requiredRole]) {
          return res.status(403).json({ message: "Insufficient role" });
        }
      }
      req.user = user;
      next();
    } catch (_e) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}
