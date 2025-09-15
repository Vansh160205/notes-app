import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";
import tenantAdminRoutes from "./routes/tenantsAdmin";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://notes-app-rvkz.vercel.app/",
];

// ✅ Use cors with function, no duplicate
app.use(cors({
  origin: "*", // allow all
  credentials: true
}));


app.use(bodyParser.json());

// Health endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/tenants/:slug", tenantAdminRoutes);

export default app;
