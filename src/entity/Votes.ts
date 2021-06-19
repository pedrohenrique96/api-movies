import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Movies } from './Movies';
import { User } from './User';

@Entity()
export class Votes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    vote: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Movies, (movie) => movie.votes)
    @JoinColumn({ name: 'movieId' })
    movie: Movies;

    @CreateDateColumn()
    created_at: Date;
}
