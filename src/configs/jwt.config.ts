import { IJWTConfig } from '@commons/interfaces';
import { registerAs } from '@nestjs/config';
import { Path } from './path.config';

export const jwtConfig = registerAs(
    Path.Token,
    (): IJWTConfig => ({
        jwtSecret: process.env.PREFIX || 'books',
        accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRATION || '1d',
    }),
);
