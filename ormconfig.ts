import { ConnectionOptions } from 'typeorm';
import { Movies } from './src/entity/Movies';
import { User } from './src/entity/User';

const config: ConnectionOptions = {
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'postgres',
    password: 'docker',
    database: 'ioasys',
    entities: [User, Movies],
    migrations: ['src/database/migration/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/database/migration',
    },
    synchronize: true,
    logging: true,
};

export = config;
