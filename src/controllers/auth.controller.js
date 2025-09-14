import { authService } from "../services/auth.service.js";
import logger from "../lib/logger.js";

export async function register(req, res) {
  try {
    logger.info(`Registration attempt for email: ${req.body.email}`);
    const { email, name, password } = req.body;
    const result = await authService.register({ email, name, password });
    if (result.error) {
      logger.warn(`Registration failed for email: ${email} - ${result.error.message}`);
      return res.status(result.error.status).json(result.error);
    }
    logger.info(`User registered successfully: ${email}`);
    res.json(result);
  } catch (error) {
    logger.error(`Registration error for email: ${req.body.email}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    logger.info(`Login attempt for email: ${req.body.email}`);
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    if (result.error) {
      logger.warn(`Login failed for email: ${email} - ${result.error.message}`);
      return res.status(result.error.status).json(result.error);
    }
    logger.info(`User logged in successfully: ${email}`);
    res.json(result);
  } catch (error) {
    logger.error(`Login error for email: ${req.body.email}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function me(req, res) {
  try {
    logger.info(`User profile request for: ${req.user.email}`);
    const u = req.user;
    res.json({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      favorites: u.favorites,
    });
  } catch (error) {
    logger.error(`Profile request error for user: ${req.user?.email}`, error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
