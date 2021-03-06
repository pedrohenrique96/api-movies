import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUsersService } from '../../services/create-users/create-users.service';
import { User } from '../../entity/User';
import { UpdateUserService } from '../../services/update-user/update-user.service';
import { ListUsersService } from '../../services/list-users/list-users.service';
import { DeleteUserService } from '../../services/delete-user/delete-user.service';

describe('UsersController', () => {
    let app: INestApplication;
    const createUsersService = { execute: () => new User() };
    const updateUserService = { execute: () => new User() };
    const listUsersService = { execute: () => [new User()] };
    const deleteUserService = { execute: () => {} };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [UsersController],
            providers: [
                CreateUsersService,
                UpdateUserService,
                ListUsersService,
                DeleteUserService,
            ],
        })
            .overrideProvider(CreateUsersService)
            .useValue(createUsersService)
            .overrideProvider(UpdateUserService)
            .useValue(updateUserService)
            .overrideProvider(ListUsersService)
            .useValue(listUsersService)
            .overrideProvider(DeleteUserService)
            .useValue(deleteUserService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/Get users`, async () => {
        return request(app.getHttpServer())
            .get('/users')
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
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

    it(`/Put user`, async () => {
        return request(app.getHttpServer())
            .put('/users/9')
            .send({
                fullname: 'Pedro',
                email: 'pedrook16@gmail.com',
                lastPassword: '456787',
                password: '123456',
            })
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    it(`/Patch user`, async () => {
        return request(app.getHttpServer())
            .patch('/users/1')
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
