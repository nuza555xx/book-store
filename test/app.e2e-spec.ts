import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { testRegister } from './member/register.e2e.spec';
import { BookConfigModule, BookJWTTokenModule } from '../src/commons/modules';
import { BookModule } from '../src/modules/book/book.module';
import { MemberModule } from '../src/modules/member/member.module';
import { testLogin } from './member/login.e2e.spec';
import { testCreateSetting } from './book/create-setting.e2e.spec';
import { testUpdateSetting } from './book/update-setting.e2e.spec';
import { testCreateContent } from './book/create-content.e2e.spec';
import { testGetContentList } from './book/get-content-list.e2e.spec';
import { testSelectContent } from './book/select-book.e2e.spec';
import { testGetSelectContentList } from './book/get-select-content.e2e.spec';
import { testCheckout } from './book/checkout.e2e.spec';

describe('E2E Tests', () => {
    let application: INestApplication;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule, BookConfigModule, BookModule, MemberModule, BookJWTTokenModule],
        }).compile();

        application = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

        application.enableShutdownHooks();
        application.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
            }),
        );

        application.setGlobalPrefix('api');
        await application.init();
        await application.getHttpAdapter().getInstance().ready();

        global.__APP__ = application;
    });

    testLogin();
    testRegister();
    testCreateSetting();
    testUpdateSetting();
    testCreateContent();
    testGetContentList();
    testSelectContent();
    testGetSelectContentList();
    testCheckout();
});
