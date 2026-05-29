import { response } from "express";
import { prisma } from "../../config/database";
import { Movie } from "../../generated/prisma/client";

export class MovieRepository {
  // find all movie
  async findAll(): Promise<Movie[]> {
    return await prisma.movie.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // find movie by Id
  async findById(id: number): Promise<Movie | null> {
    return await prisma.movie.findUnique({
      where: { id },
    });
  }

  // create new movie to database
    async createMovie(movieData: { title: string; desc: string; director: string; year: number; }): Promise<Movie> {
        return await prisma.movie.create({
            data: movieData
        });
    }

    // update movie
    async updateMovie(id: number, movieData: { title?: string; desc?: string; director?: string; year?: number }): Promise<Movie> {
        return await prisma.movie.update({
            where: { id },
            data: movieData
        });
    }

    // delete movie
    async deleteMovie(id: number): Promise<boolean> {
        try {
            await prisma.movie.delete({
                where: { id }
            });
            return true
        } catch (error) {
            return false
            response.status(404).json({message: "Fail to delete movie."})
        }
    }
}