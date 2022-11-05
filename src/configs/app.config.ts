import { registerAs } from '@nestjs/config';
import { IAppConfig } from '@commons/interfaces';
import { Path } from './path.config';

export const appConfig = registerAs(
    Path.App,
    (): IAppConfig => ({
        nodeEnv: process.env.NODE_ENV || 'development',
        name: process.env.PROJECT_NAME,
        apiPrefix: process.env.API_PREFIX || 'v1',
        prefix: process.env.PREFIX || 'books',
        version: process.env.VERSION,
        port: Number(process.env.PORT) || 3000,
    }),
);
