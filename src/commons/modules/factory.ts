import { Path } from '../../configs';
import { CacheModuleOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';

export const getElasticModuleOptions = (config: ConfigService): ElasticsearchModuleOptions => ({
    node: config.get(`${Path.Elasticsearch}.node`),
});

export const getRedisModuleOptions = (config: ConfigService): CacheModuleOptions => ({
    store: redisStore,
    host: config.get('host'),
    port: config.get('port'),
    ttl: Number(config.get('ttl')),
});

export const getJWTModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get('jwt'),
});
