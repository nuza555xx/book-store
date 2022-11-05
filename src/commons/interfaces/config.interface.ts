export interface IAppConfig {
    nodeEnv: string;
    name: string;
    apiPrefix: string;
    prefix: string;
    version: string;
    port: number;
}

export interface IJWTConfig {
    jwtSecret: string;
    accessTokenExpiration: string;
}

export interface IRedisConfig {
    host: string;
    port: string;
    ttl: number;
}
export interface IElasticConfig {
    node: string;
}
