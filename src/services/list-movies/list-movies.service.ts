import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movies } from '../../entity/Movies';
import { MoviesRepository } from '../../Repositories/MoviesRepository';

interface Request {
    name?: string;
    diretor?: string;
    gender?: string;
    actors?: string;
}

@Injectable()
export class ListMoviesService {
    constructor(
        @InjectRepository(Movies)
        private moviesRepository: MoviesRepository,
    ) {}

    async execute({
        name,
        diretor,
        gender,
        actors,
    }: Request): Promise<Movies[]> {
        if (actors) {
            const actor = await this.moviesRepository.getFindQueryBuilder(
                actors,
            );
            return actor;
        }

        const results = await this.moviesRepository.find({
            where: {
                name,
                diretor,
                gender,
            },
            order: { id: 'DESC' },
        });

        return results;
    }
}
