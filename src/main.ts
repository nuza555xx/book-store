import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { appConfig } from './configs';
import { AppModule } from './app.module';
import { IAppConfig } from '@commons/interfaces';
import { BookExceptionFilter } from '@commons/exceptions';

async function bootstrap(): Promise<void> {
    const config: IAppConfig = appConfig();

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    app.enableShutdownHooks();

    app.setGlobalPrefix(config.prefix);
    app.useGlobalFilters(new BookExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    const swaggerConfig = new DocumentBuilder()
        .setTitle(config.name)
        .setVersion(config.version)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${config.prefix}/documentation`, app, document);

    await app.listen(config.port, '0.0.0.0');

    Logger.log(`🚀 Application is running on: ${await app.getUrl()}/`);
    Logger.log(`Environment at ${config.nodeEnv}`);
}
bootstrap();
