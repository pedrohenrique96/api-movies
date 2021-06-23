import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { Votes } from '../../entity/Votes';
import { VoteService } from '../../services/vote/vote.service';
import { VotesController } from './votes.controller';

describe('VotesController', () => {
    let app: INestApplication;
    const voteService = {
        execute: () => new Votes(),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [VotesController],
            providers: [VoteService],
        })
            .overrideProvider(VoteService)
            .useValue(voteService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/Post Votes`, async () => {
        return request(app.getHttpServer())
            .post('/votes')
            .send({
                movieId: 1,
                vote: 4,
            })
            .then((resp) => {
                expect(resp.status).toBe(200);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
