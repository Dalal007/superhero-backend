import { authService } from "../services/auth.service.js";

export async function register(req, res) {
  const { email, name, password } = req.body;
  const result = await authService.register({ email, name, password });
  if (result.error) return res.status(result.error.status).json(result.error);
  res.json(result);
}

export async function login(req, res) {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  if (result.error) return res.status(result.error.status).json(result.error);
  res.json(result);
}

export async function me(req, res) {
  const u = req.user;
  res.json({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    favorites: u.favorites,
  });
}
