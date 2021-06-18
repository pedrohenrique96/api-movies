import {
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Patch,
    Put,
    Req,
    Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';
import { CreateUsersService } from '../../services/create-users/create-users.service';
import { UpdateUserService } from '../../services/update-user/update-user.service';

@Controller('users')
export class UsersController {
    constructor(
        private createUserService: CreateUsersService,
        private updateUserService: UpdateUserService,
        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response) {
        const users = await this.usersRepository.find({
            where: {
                admin: false,
                desativated: false,
            },
        });
        return res.status(HttpStatus.OK).json(users);
    }

    @Post()
    async store(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const { email, password, fullname } = req.body;

        const user = await this.createUserService.execute({
            email,
            password,
            fullname,
        });

        return res.status(HttpStatus.OK).json(user);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const { email, password, fullname, lastPassword } = req.body;

        const user = await this.updateUserService.execute({
            id,
            email,
            password,
            fullname,
            lastPassword,
        });

        return res.status(HttpStatus.OK).json(user);
    }

    @Patch(':id')
    async delete(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.usersRepository.update(id, { desativated: true });

        return res.status(HttpStatus.OK).json();
    }
}
