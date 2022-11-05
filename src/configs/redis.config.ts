import { IRedisConfig } from '@commons/interfaces';
import { registerAs } from '@nestjs/config';
import { Path } from './path.config';

export const redisConfig = registerAs(
    Path.RedisStore,
    (): IRedisConfig => ({
        host: process.env.STORAGE_REDIS_HOST || 'localhost',
        port: process.env.STORAGE_REDIS_PORT || '6379',
        ttl: Number(process.env.STORAGE_REDIS_TTL) || 3600,
    }),
);
