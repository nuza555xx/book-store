import { appConfig, elasticConfig, jwtConfig, redisConfig } from '../../configs';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { JwtModule } from '@nestjs/jwt';
import { getElasticModuleOptions, getJWTModuleOptions, getRedisModuleOptions } from './factory';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useFactory: getElasticModuleOptions,
            inject: [ConfigService],
        }),
    ],
    exports: [ElasticsearchModule],
})
export class BookElasticModule {}

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfig, elasticConfig, jwtConfig, redisConfig],
            isGlobal: true,
        }),
    ],
    exports: [ConfigModule],
})
export class BookConfigModule {}

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: getJWTModuleOptions,
            inject: [ConfigService],
        }),
    ],
    exports: [JwtModule],
})
export class BookJWTTokenModule {}

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: getRedisModuleOptions,
            inject: [ConfigService],
        }),
    ],
    exports: [CacheModule],
})
export class BookRedisModule {}
