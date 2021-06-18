import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import * as yup from 'yup';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

interface Request {
    id: number;
    email: string;
    lastPassword: string;
    password: string;
    fullname: string;
}

@Injectable()
export class UpdateUserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute({ email, fullname, password, lastPassword, id }: Request) {
        const schema = yup.object().shape({
            email: yup.string().required(),
            id: yup.number().required(),
            fullname: yup.string().required(),
            password: yup.string().required(),
            lastPassword: yup.string().required(),
        });

        if (!(await schema.isValid({ password, email, fullname, id }))) {
            throw new HttpException('Validation fails', 400);
        }

        const user = await this.usersRepository.findOne({
            where: { id, desativated: false },
        });

        if (!user) {
            throw new HttpException('user not exists', 400);
        }

        if (user.email !== email) {
            const checkUserExists = await this.usersRepository.findOne({
                where: { email, desativated: false },
            });

            if (checkUserExists) {
                throw new HttpException('Email address already used', 400);
            }
        }

        const passwordMatched = await compare(lastPassword, user.password);

        if (!passwordMatched) {
            throw new HttpException("You last password isen't corrent", 401);
        }

        const password_hash = await hash(password, 10);

        await this.usersRepository.update(user.id, {
            password: password_hash,
            fullname,
            email,
        });
    }
}
