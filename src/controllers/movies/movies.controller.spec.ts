import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Movies } from '../../entity/Movies';
import { CreateMoviesService } from '../../services/create-movies/create-movies.service';
import { ListMoviesService } from '../../services/list-movies/list-movies.service';
import { MoviesController } from './movies.controller';

interface IResponse {
    movies: Movies;
    total: number;
}

describe('MoviesController', () => {
    let app: INestApplication;
    const createMoviesService = {
        execute: () => new Movies(),
    };
    const listMoviesService = {
        execute: () => {
            return {} as IResponse;
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [MoviesController],
            providers: [CreateMoviesService, ListMoviesService],
        })
            .overrideProvider(CreateMoviesService)
            .useValue(createMoviesService)
            .overrideProvider(ListMoviesService)
            .useValue(listMoviesService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/Get movies`, async () => {
        return request(app.getHttpServer())
            .get('/movies')
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    it(`/Post movies`, async () => {
        return request(app.getHttpServer())
            .post('/movies')
            .send({
                actors: ['Froudo'],
                description: 'Qualquer',
                director: '1',
                title: 'Hobbit',
                genre: 'Aventura',
            })
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
