import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { User } from '../../entity/User';
import { CreateSessionService } from '../../services/create-session/create-session.service';
import { SessionsController } from './sessions.controller';

interface ResponseSession {
    user: User;
    token: string;
}

describe('SessionsController', () => {
    let app: INestApplication;
    const createSessionService = {
        execute: () => {
            return {} as ResponseSession;
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [SessionsController],
            providers: [CreateSessionService],
        })
            .overrideProvider(CreateSessionService)
            .useValue(createSessionService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/Post session`, async () => {
        return request(app.getHttpServer())
            .post('/sessions')
            .send({
                email: 'pedrook16@gmail.com',
                password: '123456',
            })
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
