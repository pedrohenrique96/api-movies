import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as yup from 'yup';
import { Movies } from '../../entity/Movies';
import { User } from '../../entity/User';
import { MoviesRepository } from '../../Repositories/MoviesRepository';
import { UserRepository } from '../../Repositories/UserRepository';

interface Request {
    name: string;
    diretor: string;
    gender: string;
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

    async execute({ name, diretor, gender, actors, user_id }: Request) {
        const schema = yup.object().shape({
            name: yup.string().required(),
            diretor: yup.string().required(),
            gender: yup.string().required(),
            actors: yup.array().required(),
            user_id: yup.number().required(),
        });

        if (
            !(await schema.isValid({ name, diretor, gender, actors, user_id }))
        ) {
            throw new HttpException('Validation fails', 400);
        }

        const checkMovieExists = await this.moviesRepository.findOne({
            where: { name },
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
            gender,
            diretor,
            name,
        });
        await this.moviesRepository.save(movie);

        return movie;
    }
}
