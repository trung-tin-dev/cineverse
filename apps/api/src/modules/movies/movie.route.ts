import { Router } from "express";
import { MovieController } from "./movie.controller";

const router = Router();
const movieController = new MovieController();

router.get("/", movieController.getMovie);
router.post("/", movieController.createMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

export default router;