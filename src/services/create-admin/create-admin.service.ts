import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import * as yup from 'yup';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

interface Request {
    email: string;
    password: string;
    fullname: string;
    user_id: number;
}

@Injectable()
export class CreateAdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute({ email, fullname, password, user_id }: Request) {
        const schema = yup.object().shape({
            email: yup.string().required(),
            fullname: yup.string().required(),
            password: yup.string().required(),
        });

        if (!(await schema.isValid({ password, email, fullname }))) {
            throw new HttpException('Validation fails', 400);
        }

        const checkUserIsAdmin = await this.usersRepository.findOne({
            where: { id: user_id, desativated: false },
        });

        if (!checkUserIsAdmin.admin || !checkUserIsAdmin) {
            throw new HttpException('err', 401);
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
            admin: true,
        });

        await this.usersRepository.save(user);

        delete user.password;

        return user;
    }
}
