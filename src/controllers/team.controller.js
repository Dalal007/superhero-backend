import Hero from "../models/Hero.js";
import {
  buildBalancedTeam,
  buildPowerFocused,
  randomTeam,
  compareTeams,
} from "../lib/recommend.js";

export async function recommend(req, res) {
  const { type = "balanced", stat = "strength", size = 5 } = req.query;
  const heroes = await Hero.find({});
  let team = [];
  if (type === "balanced") {
    team = buildBalancedTeam(heroes, Number(size));
  } else if (type === "power") {
    team = buildPowerFocused(heroes, String(stat), Number(size));
  } else {
    team = randomTeam(heroes, Number(size));
  }
  res.json({ team });
}

export async function compare(req, res) {
  const { teamA, teamB } = req.body; // arrays of hero ids
  const [a, b] = await Promise.all([
    Hero.find({ _id: { $in: teamA || [] } }),
    Hero.find({ _id: { $in: teamB || [] } }),
  ]);
  res.json(compareTeams(a, b));
}
