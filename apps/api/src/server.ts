import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.route.js";
import customerRoute from "./routes/customer.route.js";
import staffRoute from "./routes/staff.route.js";
import adminRoute from "./routes/admin.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authHandler } from "./routes/auth.route.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cineverse-web-chi.vercel.app"], // port nextjs frontend
    credentials: true,
  }),
);

// Better Auth
app.all("/api/auth/*", authHandler);

// Application Protected Routes (RBAC)
app.use("/api/customer", customerRoute);
app.use("/api/staff", staffRoute);
app.use("/api/admin", adminRoute);

// Health check route
app.use("/api/health", healthRoute);

// 404 route not found handler
app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});