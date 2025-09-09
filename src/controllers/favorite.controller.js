import User from "../models/User.js";

export async function addFavorite(req, res) {
  const { heroId } = req.body;
  if (!heroId) return res.status(400).json({ message: "heroId required" });
  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: heroId } },
    { new: true }
  );
  res.json({ ok: true });
}

export async function removeFavorite(req, res) {
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: req.params.heroId } },
    { new: true }
  );
  res.json({ ok: true });
}

export async function listFavorites(req, res) {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites || []);
}
