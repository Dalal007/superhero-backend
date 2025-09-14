import { heroRepository } from "../repositories/hero.repository.js";
import { buildBalancedTeam, buildPowerFocused, randomTeam, compareTeams } from "../lib/recommend.js";
import logger from "../lib/logger.js";

export const teamService = {
  async recommend({ type = "balanced", stat = "strength", size = 5 }) {
    logger.debug(`Team recommendation service - Type: ${type}, Stat: ${stat}, Size: ${size}`);
    const heroes = await heroRepository.find({}, { limit: 1000 });
    let team = [];
    if (type === "balanced") {
      team = buildBalancedTeam(heroes, Number(size));
    } else if (type === "power") {
      team = buildPowerFocused(heroes, String(stat), Number(size));
    } else {
      team = randomTeam(heroes, Number(size));
    }
    logger.debug(`Team recommendation generated ${team.length} heroes`);
    return { team };
  },

  async compare({ teamA, teamB }) {
    logger.debug(`Team comparison service - TeamA: ${teamA?.length || 0} heroes, TeamB: ${teamB?.length || 0} heroes`);
    const [a, b] = await Promise.all([
      heroRepository.findManyByIds(teamA),
      heroRepository.findManyByIds(teamB),
    ]);
    logger.debug(`Team comparison completed - Found ${a.length} heroes for TeamA, ${b.length} heroes for TeamB`);
    return compareTeams(a, b);
  },
};


