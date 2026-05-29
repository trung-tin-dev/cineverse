import { Request, Response } from "express";
import { MovieService } from "./movie.service";

const movieService = new MovieService();

export class MovieController {

    // get all movie
    async getMovie(req: Request, res: Response) {
        try {
        const movies = await movieService.getAllMovies();
        res.status(201).json({ success: true, data: movies });
        } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
        }
    }

    // create movie
    async createMovie(req: Request, res: Response) {
        try {
        const { title, desc, director, year } = req.body;
        const newMovie = await movieService.createMovie(
            title,
            desc,
            director,
            year,
        );
        res.status(201).json({ success: true, data: newMovie });
        } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        }
    }

    // update movie
    async updateMovie(req: Request, res: Response) {
        try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res
            .status(400)
            .json({ success: false, message: "ID must is a valid number!" });
        }
            
        const updatedMovie = await movieService.updateMovie(id, req.body);
        res.json({ success: true, data: updatedMovie });
        } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        }
    }

    // delete movie
    async deleteMovie(req: Request, res: Response) {
        try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res
                .status(400)
                .json({ success: false, message: "ID must is a valid number!" });
        }

        const result = await movieService.deleteMovie(id);
        res.json({ success: true, ...result });
        } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
        }
    }
}