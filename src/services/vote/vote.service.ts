import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as yup from 'yup';
import { Movies } from '../../entity/Movies';
import { User } from '../../entity/User';
import { Votes } from '../../entity/Votes';
import { MoviesRepository } from '../../Repositories/MoviesRepository';
import { UserRepository } from '../../Repositories/UserRepository';
import { VotesRepository } from '../../Repositories/VotesRepository';

interface Request {
    vote: number;
    user_id: number;
    movie_id: number;
}

@Injectable()
export class VoteService {
    constructor(
        @InjectRepository(Movies)
        private moviesRepository: MoviesRepository,
        @InjectRepository(User)
        private usersRepository: UserRepository,
        @InjectRepository(Votes)
        private votesRepository: VotesRepository,
    ) {}

    async execute({ movie_id, user_id, vote }: Request) {
        const schema = yup.object().shape({
            vote: yup.number().required(),
            user_id: yup.number().required(),
            movie_id: yup.number().required(),
        });

        if (
            !(await schema.isValid({
                vote,
                movie_id,
                user_id,
            }))
        ) {
            throw new HttpException('Validation fails', 400);
        }

        const user = await this.usersRepository.findOne({ id: user_id });
        const movie = await this.moviesRepository.findOne({ id: movie_id });

        if (!user) {
            throw new HttpException('user not exists', 400);
        } else if (user.admin) {
            throw new HttpException('user admin, dont vote in movies', 401);
        }

        if (!movie) {
            throw new HttpException('Movie not exists', 400);
        }

        const votes = this.votesRepository.create({
            user,
            vote,
            movie,
        });

        await this.votesRepository.save(votes);

        return votes;
    }
}
