import "dotenv/config";
import express from "express";
import cors from "cors";
import templates from "./routes/templates.js";
import invitations from "./routes/invitations.js";
import auth from "./routes/auth.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const FRONTEND = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(cors({ origin: [FRONTEND, "http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => res.json({ ok: true, version: "0.1.0" }));
app.use("/api/templates", templates);
app.use("/api/invitations", invitations);
app.use("/api/auth", auth);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const s = err.status ?? 500;
  res.status(s).json({ error: err.message ?? "internal error" });
});

app.listen(PORT, () => console.log(`backend http://localhost:${PORT} frontend ${FRONTEND}`));
