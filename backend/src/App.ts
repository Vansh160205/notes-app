import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import authRoutes from "./routes/auth";
import noteRoutes from "./routes/notes";
import tenantAdminRoutes from "./routes/tenantsAdmin";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",                 // local dev
  "https://notes-app-vansh160205s-projects.vercel.app/",
  "https://notes-app-phi-self-76.vercel.app/"       // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // if you're using cookies/auth headers
  })
);
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
