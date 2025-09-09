import { teamService } from "../services/team.service.js";

export async function recommend(req, res) {
  const { type = "balanced", stat = "strength", size = 5 } = req.query;
  const data = await teamService.recommend({ type, stat, size: Number(size) });
  res.json(data);
}

export async function compare(req, res) {
  const { teamA, teamB } = req.body; // arrays of hero ids
  const data = await teamService.compare({ teamA, teamB });
  res.json(data);
}
