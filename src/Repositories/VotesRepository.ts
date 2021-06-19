import { Repository, EntityRepository } from 'typeorm';
import { Votes } from '../entity/Votes';

@EntityRepository(Votes)
export class VotesRepository extends Repository<Votes> {}
