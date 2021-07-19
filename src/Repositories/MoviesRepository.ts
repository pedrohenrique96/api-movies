import { Repository, EntityRepository, getRepository } from 'typeorm';
import { Movies } from '../entity/Movies';
import { IfiltersMovies } from '../services/list-movies/list-movies.service';

@EntityRepository(Movies)
export class MoviesRepository extends Repository<Movies> {
    async findAllWithFilters({
        title,
        director,
        gender,
        actors,
        limit,
        page,
    }: IfiltersMovies) {
        page = page || 1;
        limit = limit || 10;
        const query = getRepository(Movies).createQueryBuilder('movies');

        if (actors) {
            query.andWhere('movies.actors @> ARRAY[:...actors]', {
                actors: [actors],
            });
        }

        if (title) {
            query.andWhere('movies.title like :title', {
                title: `%${title}%`,
            });
        }

        if (director) {
            query.andWhere('movies.director like :director', {
                director: `%${director}%`,
            });
        }
        if (gender) {
            query.andWhere('movies.gender = :gender', {
                gender: `%${gender}%`,
            });
        }

        const [movies, total] = await query
            .orderBy('id', 'DESC')
            .limit(limit)
            .offset((page - 1) * limit)
            .getManyAndCount();

        return { results: movies, total, totalPages: Math.ceil(total / limit) };
    }
}
