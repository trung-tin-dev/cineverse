import { error } from "console";
import { MovieRepository } from "./movie.repository";

const movieRepository = new MovieRepository();

export class MovieService {
  // get all movies
  async getAllMovies() {
    return await movieRepository.findAll();
  }

  // create movie
  async createMovie(
    title: string,
    desc: string,
    director: string,
    year: number,
  ) {
    if (year > new Date().getFullYear()) {
      throw new Error("Year is over currently");
    }
    return await movieRepository.createMovie({ title, desc, director, year });
  }

  // update movie
  async updateMovie(
    id: number,
    data: { title?: string; desc?: string; director?: string; year?: number },
  ) {
    return await movieRepository.updateMovie(id, data);
  }

  // delete movie
  async deleteMovie(id: number) {
    const isDeleted = await movieRepository.deleteMovie(id);
    if (!isDeleted)
      throw new Error("Movie not found!");
    return { message: "Delete Success!" };
  }
}