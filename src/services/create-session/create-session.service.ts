import { HttpException, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import authConfig from '../../config/auth';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@Injectable()
export class CreateSessionService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute({ email, password }: Request): Promise<Response> {
        const user = await this.usersRepository.findOne({
            where: { email, desativated: false },
        });

        if (!user) {
            throw new HttpException(
                'Incorrect email/password combination',
                401,
            );
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new HttpException(
                'Incorrect email/password combination',
                401,
            );
        }

        const { secret, expiresIn } = authConfig;

        const token = sign({}, secret, { subject: String(user.id), expiresIn });

        delete user.password;

        return {
            user,
            token,
        };
    }
}
