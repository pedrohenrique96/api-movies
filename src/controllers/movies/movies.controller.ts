import {
    Req,
    Res,
    Controller,
    Post,
    HttpStatus,
    Get,
    Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateMoviesService } from '../../services/create-movies/create-movies.service';
import { ListMoviesService } from '../../services/list-movies/list-movies.service';

@Controller('movies')
export class MoviesController {
    constructor(
        private createMoviesService: CreateMoviesService,
        private listMoviesService: ListMoviesService,
    ) {}

    @Get()
    async getAll(
        @Query('name') name: string,
        @Query('diretor') diretor: string,
        @Query('gender') gender: string,
        @Query('actors') actors: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const movies = await this.listMoviesService.execute({
            actors,
            gender,
            diretor,
            name,
        });

        return res.status(HttpStatus.OK).json(movies);
    }

    @Post()
    async store(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const { actors, name, diretor, gender } = req.body;
        const user_id = req.user_id;

        const movie = await this.createMoviesService.execute({
            actors,
            name,
            diretor,
            gender,
            user_id,
        });

        return res.status(HttpStatus.OK).json(movie);
    }
}
