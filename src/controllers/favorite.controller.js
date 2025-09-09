import { favoriteService } from "../services/favorite.service.js";

export async function addFavorite(req, res) {
  const { heroId } = req.body;
  const result = await favoriteService.add(req.user._id, heroId);
  if (result.error) return res.status(result.error.status).json(result.error);
  res.json(result);
}

export async function removeFavorite(req, res) {
  const result = await favoriteService.remove(req.user._id, req.params.heroId);
  if (result.error) return res.status(result.error.status).json(result.error);
  res.json(result);
}

export async function listFavorites(req, res) {
  const items = await favoriteService.list(req.user._id);
  res.json(items);
}
