import { BookConfigModule, BookJWTTokenModule } from '../../commons/modules';
import { CacheModule } from '@nestjs/common';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import { IndexPath } from '../../commons/enums';
import { MemberService } from './member.abstract';
import { Test, TestingModule } from '@nestjs/testing';
import ClientMock from '@elastic/elasticsearch-mock';
import { MemberServiceImpl } from './member.implement';
import { Role } from './member.enum';
import { JwtService } from '@nestjs/jwt';
import { IMember } from './member.interface';
import { isJWT } from 'class-validator';

describe('BookService', () => {
    let service: MemberService;
    let moduleRef: TestingModule;
    let mock: ClientMock;
    let jwt: JwtService;
    let elasticsearch: ElasticsearchService;

    beforeAll(async () => {
        mock = new ClientMock();
        moduleRef = await Test.createTestingModule({
            imports: [
                BookConfigModule,
                BookJWTTokenModule,
                CacheModule.registerAsync({ useFactory: () => ({}) }),
                ElasticsearchModule.registerAsync({
                    useFactory: () => ({
                        node: 'http://localhost:9200',
                        Connection: mock.getConnection(),
                    }),
                }),
            ],
            providers: [
                {
                    provide: MemberService,
                    useClass: MemberServiceImpl,
                },

                {
                    provide: ElasticsearchService,
                    useClass: ClientMock,
                },
            ],
        }).compile();

        service = moduleRef.get<MemberService>(MemberService);
        jwt = moduleRef.get<JwtService>(JwtService);
        elasticsearch = moduleRef.get<ElasticsearchService>(ElasticsearchService);
    });

    afterAll(async () => {
        mock.clearAll();
        await moduleRef.close();
    });

    describe('#register', () => {
        beforeAll(() => {
            jest.spyOn(service, 'register').mockImplementation(
                async (dto): Promise<{ accessToken }> => {
                    mock.add({ method: 'GET', path: `/${IndexPath.Member}/_search` }, () => ({
                        hits: { hits: [{ _source: dto }] },
                    }));

                    const { hits } = await elasticsearch.search<IMember>({
                        index: IndexPath.Member,
                    });

                    const [payload] = hits.hits;

                    const token = jwt.sign(
                        { id: payload._source, role: payload._source.role },
                        { secret: 'abcd', expiresIn: '1day' },
                    );

                    return { accessToken: token };
                },
            );
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should create a admin user', async () => {
            const dto = {
                username: 'admin',
                displayName: 'test test',
                password: '12345678',
                role: Role.ADMIN,
            };

            const { accessToken } = await service.register(dto);

            expect(isJWT(accessToken)).toBe(true);
        });

        it('should create a member user', async () => {
            const dto = {
                username: 'member',
                displayName: 'test test',
                password: '12345678',
                role: Role.MEMBER,
            };

            const { accessToken } = await service.register(dto);

            expect(isJWT(accessToken)).toBe(true);
        });
    });

    describe('#login', () => {
        beforeAll(() => {
            jest.spyOn(service, 'login').mockImplementation(
                async (dto): Promise<{ accessToken }> => {
                    mock.add({ method: 'GET', path: `/${IndexPath.Member}/_search` }, () => ({
                        hits: { hits: [{ _source: dto }] },
                    }));

                    const { hits } = await elasticsearch.search<IMember>({
                        index: IndexPath.Member,
                    });

                    const [payload] = hits.hits;

                    const token = jwt.sign(
                        { id: payload._source, role: payload._source.role },
                        { secret: 'abcd', expiresIn: '1day' },
                    );

                    return { accessToken: token };
                },
            );
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should create a admin user', async () => {
            const dto = {
                username: 'admin',
                password: '12345678',
            };

            const { accessToken } = await service.login(dto);

            expect(isJWT(accessToken)).toBe(true);
        });

        it('should create a member user', async () => {
            const dto = {
                username: 'member',
                password: '12345678',
            };

            const { accessToken } = await service.login(dto);

            expect(isJWT(accessToken)).toBe(true);
        });
    });
});
