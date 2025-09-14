import { teamService } from "../services/team.service.js";
import logger from "../lib/logger.js";

export async function recommend(req, res) {
  try {
    const { type = "balanced", stat = "strength", size = 5 } = req.query;
    logger.info(`Team recommendation request - Type: ${type}, Stat: ${stat}, Size: ${size}`);
    const data = await teamService.recommend({ type, stat, size: Number(size) });
    logger.info(`Team recommendation returned ${data.team.length} heroes`);
    res.json(data);
  } catch (error) {
    logger.error("Error generating team recommendation", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function compare(req, res) {
  try {
    const { teamA, teamB } = req.body; // arrays of hero ids
    logger.info(`Team comparison request - TeamA: ${teamA?.length || 0} heroes, TeamB: ${teamB?.length || 0} heroes`);
    const data = await teamService.compare({ teamA, teamB });
    logger.info(`Team comparison completed successfully`);
    res.json(data);
  } catch (error) {
    logger.error("Error comparing teams", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
