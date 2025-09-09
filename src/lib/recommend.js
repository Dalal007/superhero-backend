// Simple balanced team + power-focused and random generators.
// You can extend this with weights or ELO later.
export function buildBalancedTeam(heroes, size = 5) {
  const buckets = { good: [], bad: [], neutral: [] };
  for (const h of heroes) {
    const a = (h.biography?.alignment || "").toLowerCase();
    if (a === "good") buckets.good.push(h);
    else if (a === "bad") buckets.bad.push(h);
    else buckets.neutral.push(h);
  }
  const out = [];
  const pick = (arr, n) => {
    while (arr.length && n--) {
      out.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }
  };
  pick(buckets.good, 2);
  pick(buckets.bad, 2);
  pick(buckets.neutral, size - out.length);
  return out.slice(0, size);
}

export function buildPowerFocused(heroes, stat = "strength", size = 5) {
  const sorted = heroes
    .filter((h) => Number.isFinite(h.powerstats?.[stat]))
    .sort((a, b) => (b.powerstats?.[stat] || 0) - (a.powerstats?.[stat] || 0));
  // Build a high-powered pool and then randomly pick to allow refresh variety
  const poolSize = Math.max(size * 3, 12);
  const pool = sorted.slice(0, poolSize);
  const out = [];
  const arr = [...pool];
  while (arr.length && out.length < size) {
    out.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
  }
  return out;
}

export function randomTeam(heroes, size = 5) {
  const arr = [...heroes];
  const out = [];
  while (arr.length && out.length < size) {
    out.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
  }
  return out;
}

export function compareTeams(teamA, teamB) {
  const sum = (t) =>
    [
      "intelligence",
      "strength",
      "speed",
      "durability",
      "power",
      "combat",
    ].reduce(
      (acc, k) => acc + t.reduce((s, h) => s + (h.powerstats?.[k] || 0), 0),
      0
    );
  const a = sum(teamA),
    b = sum(teamB);
  const winner = a === b ? "draw" : a > b ? "A" : "B";
  return {
    teamAPoints: a,
    teamBPoints: b,
    winner,
    explanation: `Team ${
      winner === "draw" ? "A & B are tied" : winner
    } has higher aggregate stats.`,
  };
}
