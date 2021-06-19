import {
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    Put,
    Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { User } from '../../entity/User';
import { UserRepository } from '../../Repositories/UserRepository';
import { CreateAdminService } from '../../services/create-admin/create-admin.service';
import { UpdateUserService } from '../../services/update-user/update-user.service';

@Controller('admin')
export class CreateAdminController {
    constructor(
        private createAdminService: CreateAdminService,
        private updateUserService: UpdateUserService,

        @InjectRepository(User)
        private usersRepository: UserRepository,
    ) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response) {
        const users = await this.usersRepository.find({
            where: {
                admin: true,
                desativated: false,
            },
        });

        return res.status(HttpStatus.OK).json(users);
    }

    @Get(':id')
    async getById(
        @Param(':id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const user = await this.usersRepository.findOne({
            where: { id, admin: true, desativated: false },
        });
        return res.status(HttpStatus.OK).json(user);
    }

    @Post()
    async store(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const { email, password, fullname } = req.body;
        const user_id = req.user_id;

        const user = await this.createAdminService.execute({
            email,
            password,
            fullname,
            user_id,
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
}
