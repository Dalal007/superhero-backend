import "dotenv/config";
import axios from "axios";
import Hero from "../models/Hero.js";
import { connectDB } from "../lib/db.js";

const BASE = `https://superheroapi.com/api/${process.env.SUPERHERO_API_TOKEN}`;

async function fetchHero(id) {
  // The "all-in-one" /:id endpoint already includes most fields.
  const { data } = await axios.get(`${BASE}/${id}`);
  if (data?.response === "error") return null;

  return {
    externalId: Number(id),
    name: data.name,
    powerstats: Object.fromEntries(
      Object.entries(data.powerstats || {}).map(([k, v]) => [k, Number(v) || 0])
    ),
    biography: {
      fullName: data.biography?.["full-name"],
      alterEgos: data.biography?.["alter-egos"],
      aliases: data.biography?.aliases,
      placeOfBirth: data.biography?.["place-of-birth"],
      firstAppearance: data.biography?.["first-appearance"],
      publisher: data.biography?.publisher,
      alignment: data.biography?.alignment,
    },
    appearance: {
      gender: data.appearance?.gender,
      race: data.appearance?.race,
      height: data.appearance?.height,
      weight: data.appearance?.weight,
      eyeColor: data.appearance?.["eye-color"],
      hairColor: data.appearance?.["hair-color"],
    },
    work: data.work,
    connections: {
      groupAffiliation: data.connections?.["group-affiliation"],
      relatives: data.connections?.relatives,
    },
    imageUrl: data.image?.url,
  };
}

(async () => {
  await connectDB();
  const count = Number(process.env.SEED_HERO_COUNT || 50);
  const ids = Array.from({ length: count }, (_, i) => i + 1); // first N heroes
  const docs = [];
  for (const id of ids) {
    try {
      const hero = await fetchHero(id);
      if (hero) docs.push(hero);
    } catch (_e) {
      /* ignore missing ids */
    }
  }
  await Hero.deleteMany({});
  await Hero.insertMany(docs);
  console.log(`Seeded ${docs.length} heroes`);
  process.exit(0);
})();
