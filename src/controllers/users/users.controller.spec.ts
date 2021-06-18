import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUsersService } from '../../services/create-users/create-users.service';
import { User } from '../../entity/User';

describe('UsersController', () => {
    let app: INestApplication;
    const createUsersService = { execute: () => new User() };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [UsersController],
            providers: [CreateUsersService],
        })
            .overrideProvider(CreateUsersService)
            .useValue(createUsersService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/Post users`, async () => {
        return request(app.getHttpServer())
            .post('/users')
            .send({
                fullname: 'Pedro',
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
