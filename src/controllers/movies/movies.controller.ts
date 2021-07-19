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
        @Query('title') title: string,
        @Query('director') director: string,
        @Query('gender') gender: string,
        @Query('actors') actors: string,
        @Query('limit') limit: number,
        @Query('page') page: number,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const results = await this.listMoviesService.execute({
            actors,
            gender,
            director,
            title,
            limit,
            page,
        });

        return res.status(HttpStatus.OK).json(results);
    }

    @Post()
    async store(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const { actors, description, director, title, genre } = req.body;
        const user_id = req.user_id;

        const movie = await this.createMoviesService.execute({
            actors,
            description,
            director,
            title,
            genre,
            user_id,
        });

        return res.status(HttpStatus.OK).json(movie);
    }
}
