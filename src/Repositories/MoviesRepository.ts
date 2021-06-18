import { Repository, EntityRepository, getRepository } from 'typeorm';
import { Movies } from '../entity/Movies';

@EntityRepository(Movies)
export class MoviesRepository extends Repository<Movies> {
    async getFindQueryBuilder(actors: string) {
        const movies = await getRepository(Movies)
            .createQueryBuilder('movies')
            .where('movies.actors @> ARRAY[:...actors]', { actors: [actors] })
            .getMany();

        return movies;
    }
}
