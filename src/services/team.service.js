import { heroRepository } from "../repositories/hero.repository.js";
import { buildBalancedTeam, buildPowerFocused, randomTeam, compareTeams } from "../lib/recommend.js";

export const teamService = {
  async recommend({ type = "balanced", stat = "strength", size = 5 }) {
    const heroes = await heroRepository.find({}, { limit: 1000 });
    let team = [];
    if (type === "balanced") {
      team = buildBalancedTeam(heroes, Number(size));
    } else if (type === "power") {
      team = buildPowerFocused(heroes, String(stat), Number(size));
    } else {
      team = randomTeam(heroes, Number(size));
    }
    return { team };
  },

  async compare({ teamA, teamB }) {
    const [a, b] = await Promise.all([
      heroRepository.findManyByIds(teamA),
      heroRepository.findManyByIds(teamB),
    ]);
    return compareTeams(a, b);
  },
};


