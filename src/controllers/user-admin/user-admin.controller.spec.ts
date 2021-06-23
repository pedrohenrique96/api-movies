import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../../entity/User';
import { CreateAdminService } from '../../services/create-admin/create-admin.service';
import { DeleteAdminService } from '../../services/delete-admin/delete-admin.service';
import { ListAdminService } from '../../services/list-admin/list-admin.service';
import { UpdateUserService } from '../../services/update-user/update-user.service';
import { UserAdminController } from './user-admin.controller';

describe('UserAdminController', () => {
    let app: INestApplication;
    const createAdminService = { execute: () => new User() };
    const updateUserService = { execute: () => Promise };
    const listAdminService = { execute: () => [new User()] };
    const deleteAdminService = { execute: () => {} };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [UserAdminController],
            providers: [
                CreateAdminService,
                UpdateUserService,
                ListAdminService,
                DeleteAdminService,
            ],
        })
            .overrideProvider(CreateAdminService)
            .useValue(createAdminService)
            .overrideProvider(UpdateUserService)
            .useValue(updateUserService)
            .overrideProvider(ListAdminService)
            .useValue(listAdminService)
            .overrideProvider(DeleteAdminService)
            .useValue(deleteAdminService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/Get admin`, async () => {
        return request(app.getHttpServer())
            .get('/admin')
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    it(`/Post admin`, async () => {
        return request(app.getHttpServer())
            .post('/admin')
            .send({
                fullname: 'Pedro',
                email: 'pedrook16@gmail.com',
                password: '123456',
            })
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    it(`/Put admin`, async () => {
        return request(app.getHttpServer())
            .put('/admin/9')
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

    it(`/Patch admin`, async () => {
        return request(app.getHttpServer())
            .patch('/admin/1')
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
