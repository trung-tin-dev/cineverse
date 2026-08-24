import "dotenv/config";
import express from "express";
import cors from "cors";

import healthRoute from "./routes/health.route";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // port nextjs frontend 
  }),
);

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