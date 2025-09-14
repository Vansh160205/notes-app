import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";
import tenantAdminRoutes from "./routes/tenantsAdmin";

const app = express();

app.use(cors());
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
