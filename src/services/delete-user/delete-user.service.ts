import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';

@Injectable()
export class DeleteUserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    async execute(id: number) {
        await this.usersRepository.update(id, { desativated: true });
    }
}
