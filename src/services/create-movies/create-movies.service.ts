import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as yup from 'yup';
import { Movies } from '../../entity/Movies';
import { User } from '../../entity/User';
import { MoviesRepository } from '../../Repositories/MoviesRepository';
import { UserRepository } from '../../Repositories/UserRepository';

interface Request {
    title: string;
    director: string;
    description: string;
    genre: string;
    actors: [];
    user_id: number;
}

@Injectable()
export class CreateMoviesService {
    constructor(
        @InjectRepository(Movies)
        private moviesRepository: MoviesRepository,
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute({
        title,
        director,
        description,
        genre,
        actors,
        user_id,
    }: Request) {
        const schema = yup.object().shape({
            title: yup.string().required(),
            director: yup.string().required(),
            genre: yup.string().required(),
            description: yup.string().required(),
            actors: yup.array().required(),
            user_id: yup.number().required(),
        });

        if (
            !(await schema.isValid({
                title,
                director,
                genre,
                description,
                actors,
                user_id,
            }))
        ) {
            throw new HttpException('Validation fails', 400);
        }

        const checkMovieExists = await this.moviesRepository.findOne({
            where: { title },
        });

        if (checkMovieExists) {
            throw new HttpException('Name movies already used', 400);
        }

        const user = await this.usersRepository.findOne({ id: user_id });

        if (!user.admin) {
            throw new HttpException(
                'user not admin, for add to movies need be admin',
                401,
            );
        }

        const movie = this.moviesRepository.create({
            actors,
            director,
            genre,
            description,
            title,
        });
        await this.moviesRepository.save(movie);

        return movie;
    }
}
