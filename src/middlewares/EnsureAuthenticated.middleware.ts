import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: number;
}

@Injectable()
export class EnsureAuthenticatedMiddleware implements NestMiddleware {
    use(request: Request, res: Response, next: NextFunction) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new HttpException('JWT token is missing', 400);
        }

        const [, token] = authHeader.split(' ');

        try {
            const decoded = verify(token, authConfig.secret);

            const { sub } = decoded as TokenPayload;

            request.user_id = sub;

            return next();
        } catch {
            throw new HttpException('Invalid JWT token', 400);
        }
    }
}
