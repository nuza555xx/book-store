import { registerAs } from '@nestjs/config';
import { IElasticConfig } from '@commons/interfaces';
import { Path } from './path.config';

export const elasticConfig = registerAs(
    Path.Elasticsearch,
    (): IElasticConfig => ({
        node: process.env.ELASTICSEARCH_NODE,
    }),
);
