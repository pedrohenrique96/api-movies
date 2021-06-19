import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { VoteService } from '../../services/vote/vote.service';

@Controller('votes')
export class VotesController {
    constructor(private voteService: VoteService) {}

    @Post()
    async store(@Req() req: Request, @Res() res: Response): Promise<Response> {
        const { movieId, vote } = req.body;
        const user_id = req.user_id;

        const movie = await this.voteService.execute({
            movie_id: movieId,
            user_id,
            vote,
        });

        return res.status(HttpStatus.OK).json(movie);
    }
}
