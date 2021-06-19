import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './Repositories/UserRepository';

import * as ormconfig from '../ormconfig';
import { UsersController } from './controllers/users/users.controller';
import { CreateUsersService } from './services/create-users/create-users.service';
import { CreateSessionService } from './services/create-session/create-session.service';
import { SessionsController } from './controllers/sessions/sessions.controller';
import { EnsureAuthenticatedMiddleware } from './middlewares/EnsureAuthenticated.middleware';
import { CreateAdminService } from './services/create-admin/create-admin.service';
import { UpdateUserService } from './services/update-user/update-user.service';
import { CreateAdminController } from './controllers/create-admin/create-admin.controller';
import { MoviesController } from './controllers/movies/movies.controller';
import { CreateMoviesService } from './services/create-movies/create-movies.service';
import { ListMoviesService } from './services/list-movies/list-movies.service';
import { MoviesRepository } from './Repositories/MoviesRepository';
import { VotesRepository } from './Repositories/VotesRepository';
import { VoteService } from './services/vote/vote.service';
import { VotesController } from './controllers/votes/votes.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot(ormconfig),
        TypeOrmModule.forFeature([
            UserRepository,
            MoviesRepository,
            VotesRepository,
        ]),
    ],
    controllers: [
        UsersController,
        SessionsController,
        CreateAdminController,
        MoviesController,
        VotesController,
    ],
    providers: [
        CreateUsersService,
        CreateSessionService,
        CreateAdminService,
        UpdateUserService,
        CreateMoviesService,
        ListMoviesService,
        VoteService,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(EnsureAuthenticatedMiddleware)
            .forRoutes('admin', 'movies', 'votes');
    }
}
