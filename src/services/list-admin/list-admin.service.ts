import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

@Injectable()
export class ListAdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute() {
        const [admin, total] = await this.usersRepository.findAndCount({
            order: { id: 'DESC' },
            where: {
                admin: true,
                deactivated: false,
            },
        });

        return { admin, total };
    }
}
