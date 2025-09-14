import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import teamRoutes from "./routes/team.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// --- Security & tooling middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

// --- API health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// --- Routes
app.use("/api/auth", authRoutes);
app.use("/api/heroes", heroRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

// --- Start
await connectDB();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API listening on :${port}`));
