import { Injectable, HttpException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import * as yup from 'yup';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

interface Request {
    email: string;
    password: string;
    fullname: string;
}

@Injectable()
export class CreateUsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute({ email, fullname, password }: Request) {
        const schema = yup.object().shape({
            email: yup.string().required(),
            fullname: yup.string().required(),
            password: yup.string().required(),
        });

        if (!(await schema.isValid({ password, email, fullname }))) {
            throw new HttpException('Validation fails', 400);
        }

        const checkUserExists = await this.usersRepository.findOne({
            where: { email, desativated: false },
        });

        if (checkUserExists) {
            throw new HttpException('Email address already used', 400);
        }

        const password_hash = await hash(password, 10);

        const user = this.usersRepository.create({
            email,
            password: password_hash,
            fullname,
            admin: false,
        });

        await this.usersRepository.save(user);

        delete user.password;

        return user;
    }
}
