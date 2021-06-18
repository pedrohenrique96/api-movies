import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { CreateSessionService } from '../../services/create-session/create-session.service';

@Controller('sessions')
export class SessionsController {
    constructor(private createSessionService: CreateSessionService) {}

    @Post()
    async store(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const { email, password } = req.body;
        const session = await this.createSessionService.execute({
            email,
            password,
        });
        return res.status(HttpStatus.OK).json(session);
    }
}
