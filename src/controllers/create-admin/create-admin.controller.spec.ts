import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { User } from '../../entity/User';
import { CreateAdminService } from '../../services/create-admin/create-admin.service';
import { CreateAdminController } from './create-admin.controller';

describe('CreateAdminController', () => {
    let app: INestApplication;
    const createAdminService = { execute: () => new User() };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [CreateAdminController],
            providers: [CreateAdminService],
        })
            .overrideProvider(CreateAdminService)
            .useValue(createAdminService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
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

    afterAll(async () => {
        await app.close();
    });
});
