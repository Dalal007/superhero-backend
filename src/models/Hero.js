import mongoose from "mongoose";

const powerstatsSchema = new mongoose.Schema(
  {
    intelligence: Number,
    strength: Number,
    speed: Number,
    durability: Number,
    power: Number,
    combat: Number,
  },
  { _id: false }
);

const appearanceSchema = new mongoose.Schema(
  {
    gender: String,
    race: String,
    height: [String],
    weight: [String],
    eyeColor: String,
    hairColor: String,
  },
  { _id: false }
);

const biographySchema = new mongoose.Schema(
  {
    fullName: String,
    alterEgos: String,
    aliases: [String],
    placeOfBirth: String,
    firstAppearance: String,
    publisher: String,
    alignment: String,
  },
  { _id: false }
);

const workSchema = new mongoose.Schema(
  { occupation: String, base: String },
  { _id: false }
);
const connectionsSchema = new mongoose.Schema(
  { groupAffiliation: String, relatives: String },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    externalId: { type: Number, index: true }, // Superhero API numeric id
    name: { type: String, index: true, required: true },
    powerstats: powerstatsSchema,
    biography: biographySchema,
    appearance: appearanceSchema,
    work: workSchema,
    connections: connectionsSchema,
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);
