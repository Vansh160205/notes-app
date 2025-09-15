import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";
import tenantAdminRoutes from "./routes/tenantsAdmin";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
];

// ✅ Use cors with a function to handle different origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. from mobile apps, curl, or server-to-server requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight *without* overriding previous config
app.options("*", (req, res) => {
  res.sendStatus(200);
});

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