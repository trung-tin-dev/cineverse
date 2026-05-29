import express, { Request, Response } from "express";
import dotenv from "dotenv";
import movieRoutes from "./modules/movies/movie.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(express.json());

// Endpoint for movie
app.use("/api/movies", movieRoutes);

// Endpoint to check health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Server Express is running in Turborepo",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.json({message: "Welcome to my API Movie :)"})
})

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
