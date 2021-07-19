import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movies } from '../../entity/Movies';
import { MoviesRepository } from '../../Repositories/MoviesRepository';

export interface IfiltersMovies {
    title?: string;
    director?: string;
    gender?: string;
    actors?: string;
    limit?: number;
    page?: number;
}

@Injectable()
export class ListMoviesService {
    constructor(
        @InjectRepository(Movies)
        private moviesRepository: MoviesRepository,
    ) {}

    async execute({
        title,
        director,
        gender,
        actors,
        limit = 10,
        page = 1,
    }: IfiltersMovies) {
        const movies = await this.moviesRepository.findAllWithFilters({
            title,
            director,
            gender,
            actors,
            limit,
            page,
        });

        return movies;
    }
}
