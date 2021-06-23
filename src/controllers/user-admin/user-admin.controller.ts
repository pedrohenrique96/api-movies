import {
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    Put,
    Param,
    Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateAdminService } from '../../services/create-admin/create-admin.service';
import { DeleteAdminService } from '../../services/delete-admin/delete-admin.service';
import { ListAdminService } from '../../services/list-admin/list-admin.service';
import { UpdateUserService } from '../../services/update-user/update-user.service';

@Controller('admin')
export class UserAdminController {
    constructor(
        private createAdminService: CreateAdminService,
        private updateUserService: UpdateUserService,
        private listAdminService: ListAdminService,
        private deleteAdminService: DeleteAdminService,
    ) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response) {
        const admins = await this.listAdminService.execute();
        return res.status(HttpStatus.OK).json(admins);
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

    @Patch(':id')
    async delete(
        @Param('id') id: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        await this.deleteAdminService.execute(id);

        return res.status(HttpStatus.OK).json();
    }
}
