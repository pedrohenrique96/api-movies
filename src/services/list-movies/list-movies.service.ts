import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movies } from '../../entity/Movies';
import { MoviesRepository } from '../../Repositories/MoviesRepository';

interface Request {
    name?: string;
    diretor?: string;
    gender?: string;
    actors?: string;
    pagination: { take?: number; page?: number };
}

@Injectable()
export class ListMoviesService {
    constructor(
        @InjectRepository(Movies)
        private moviesRepository: MoviesRepository,
    ) {}

    async execute({ name, diretor, gender, actors, pagination }: Request) {
        const take = pagination.take || 10;
        const page = pagination.page || 1;
        const skip = (page + 1) * take;

        if (actors) {
            const results = await this.moviesRepository.getFindQueryBuilder(
                actors,
            );
            return results;
        }

        const [movies, total] = await this.moviesRepository.findAndCount({
            order: { id: 'DESC' },
            relations: ['votes'],
            take,
            skip,
        });

        return { movies, total };
    }
}
