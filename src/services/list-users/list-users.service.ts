import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

@Injectable()
export class ListUsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute() {
        const results = await this.usersRepository.find({
            where: {
                admin: false,
                deactivated: false,
            },
        });

        return results;
    }
}
