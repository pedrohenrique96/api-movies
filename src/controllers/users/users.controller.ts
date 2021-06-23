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
import { Request, Response } from 'express';
import { CreateUsersService } from '../../services/create-users/create-users.service';
import { DeleteUserService } from '../../services/delete-user/delete-user.service';
import { ListUsersService } from '../../services/list-users/list-users.service';
import { UpdateUserService } from '../../services/update-user/update-user.service';

@Controller('users')
export class UsersController {
    constructor(
        private createUserService: CreateUsersService,
        private updateUserService: UpdateUserService,
        private listUsersService: ListUsersService,
        private deleteUserService: DeleteUserService,
    ) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response) {
        const users = await this.listUsersService.execute();
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
        await this.deleteUserService.execute(id);

        return res.status(HttpStatus.OK).json();
    }
}
