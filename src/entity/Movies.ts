import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Votes } from './Votes';

@Entity()
export class Movies {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    title: string;

    @Column({ length: 250 })
    description: string;

    @Column({ length: 50 })
    director: string;

    @Column()
    genre: string;

    @OneToMany(() => Votes, (v) => v.movie)
    @JoinColumn({ name: 'movieId' })
    votes: Votes[];

    @Column('text', { array: true })
    actors: string[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
