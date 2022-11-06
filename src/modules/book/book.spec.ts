import { BookConfigModule } from '../../commons/modules';
import { IndexPath } from '../../commons/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.abstract';
import { BookServiceImpl } from './book.implement';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';
import ClientMock from '@elastic/elasticsearch-mock';
import { PointEnabled, Visibility } from './book.enum';
import { ContentResponse, IContent } from './book.interface';
import { v4 } from 'uuid';
import { GetContentQuery } from './book.dto';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

describe('BookService', () => {
    let service: BookService;
    let moduleRef: TestingModule;
    let mock: ClientMock;
    let cache: Cache;
    let elasticsearch: ElasticsearchService;

    beforeAll(async () => {
        mock = new ClientMock();
        moduleRef = await Test.createTestingModule({
            imports: [
                BookConfigModule,
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
                    provide: BookService,
                    useClass: BookServiceImpl,
                },

                {
                    provide: ElasticsearchService,
                    useClass: ClientMock,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: () => 'any value',
                        set: () => jest.fn(),
                    },
                },
            ],
        }).compile();

        service = moduleRef.get<BookService>(BookService);
        elasticsearch = moduleRef.get<ElasticsearchService>(ElasticsearchService);
        cache = moduleRef.get<Cache>(CACHE_MANAGER);
    });

    afterAll(async () => {
        mock.clearAll();
        await moduleRef.close();
    });

    describe('#createPointSetting', () => {
        beforeAll(() => {
            jest.spyOn(service, 'createPointSetting').mockImplementation((dto): Promise<void> => {
                mock.add({ method: 'GET', path: `/${IndexPath.SettingPoint}/_search` }, () => ({
                    hits: { hits: [{ _source: dto }] },
                }));
                return;
            });
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should create a point setting', async () => {
            const dto = {
                enabled: PointEnabled.ACTIVE,
                oneTo: 1,
            };

            await service.createPointSetting(dto);

            const { hits } = await elasticsearch.search({
                index: IndexPath.SettingPoint,
            });

            expect(hits.hits).toContainEqual({
                _source: {
                    enabled: PointEnabled.ACTIVE,
                    oneTo: 1,
                },
            });

            expect(hits.hits).toHaveLength(1);
        });
    });

    describe('#updatePointSetting', () => {
        beforeAll(() => {
            jest.spyOn(service, 'updatePointSetting').mockImplementation((dto): Promise<void> => {
                mock.add({ method: 'GET', path: `/${IndexPath.SettingPoint}/_search` }, () => ({
                    hits: { hits: [{ _source: dto }] },
                }));
                return;
            });
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should create a point setting', async () => {
            const dto = {
                enabled: PointEnabled.ACTIVE,
                oneTo: 10,
            };

            await service.updatePointSetting(dto);

            const { hits } = await elasticsearch.search({
                index: IndexPath.SettingPoint,
            });

            expect(hits.hits).toContainEqual({
                _source: {
                    enabled: PointEnabled.ACTIVE,
                    oneTo: 10,
                },
            });

            expect(hits.hits).toHaveLength(1);
        });
    });

    describe('#createContent', () => {
        beforeAll(() => {
            jest.spyOn(service, 'createContent').mockImplementation((dto): Promise<void> => {
                mock.add({ method: 'GET', path: `/${IndexPath.Content}/_search` }, () => ({
                    hits: { hits: [{ _source: dto }] },
                }));
                return;
            });
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should create a content book', async () => {
            const dto = {
                name: 'test',
                description: 'test',
                author: 'test',
                price: 1,
                visibility: Visibility.PUBLISH,
            };

            await service.createContent(dto);

            const { hits } = await elasticsearch.search({
                index: IndexPath.Content,
            });

            expect(hits.hits).toContainEqual({
                _source: {
                    name: 'test',
                    description: 'test',
                    author: 'test',
                    price: 1,
                    visibility: Visibility.PUBLISH,
                },
            });

            expect(hits.hits).toHaveLength(1);
        });
    });

    describe('#getContent', () => {
        beforeAll(() => {
            jest.spyOn(service, 'getContent').mockImplementation(
                async (_: string, query: GetContentQuery): Promise<ContentResponse> => {
                    const dto = {
                        name: 'test',
                        description: 'test',
                        author: 'test',
                        price: 1,
                        visibility: Visibility.PUBLISH,
                    };

                    mock.add({ method: 'GET', path: `/${IndexPath.Content}/_search` }, () => ({
                        hits: {
                            hits: [{ _source: dto }],
                        },
                    }));

                    const { hits } = await elasticsearch.search<IContent>({
                        index: IndexPath.Content,
                    });

                    const contents = hits.hits.map((hit) => ({ ...hit._source }));

                    return {
                        page: +query.page,
                        count: query.page * query.size,
                        total: contents.length,
                        payload: contents,
                    };
                },
            );
        });

        afterAll(() => {
            mock.clearAll();
        });

        it('should get a content book', async () => {
            const content = await service.getContent(v4(), { size: 1, page: 1 });

            expect(content.page).toEqual(1);
            expect(content.payload).toContainEqual({
                name: 'test',
                description: 'test',
                author: 'test',
                price: 1,
                visibility: 'publish',
            });
        });
    });

    describe('#selectContent', () => {
        beforeAll(() => {
            jest.spyOn(service, 'selectContent').mockResolvedValueOnce();
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should create a select content', async () => {
            const contentId = String(v4());
            const dto = {
                contentId: [contentId],
            };

            await service.selectContent(v4(), dto);

            jest.spyOn(cache, 'get').mockResolvedValueOnce(JSON.stringify(dto));

            const store = await cache.get('test');

            expect(JSON.parse(store as string)).toEqual(dto);
        });
    });

    describe('#getSelectedContent', () => {
        beforeAll(() => {
            jest.spyOn(service, 'getSelectedContent').mockImplementation(
                async (_: string, query: GetContentQuery): Promise<ContentResponse> => {
                    const dto = {
                        name: 'test',
                        description: 'test',
                        author: 'test',
                        price: 1,
                        visibility: Visibility.PUBLISH,
                    };

                    return {
                        page: +query.page,
                        count: query.page * query.size,
                        total: [dto].length,
                        payload: [dto],
                    };
                },
            );
        });
        afterAll(() => {
            mock.clearAll();
        });

        it('should get a select content', async () => {
            const content = await service.getSelectedContent(v4(), { size: 1, page: 1 });

            expect(content.page).toEqual(1);
            expect(content.payload).toContainEqual({
                name: 'test',
                description: 'test',
                author: 'test',
                price: 1,
                visibility: 'publish',
            });
        });
    });

    describe('#getLibrary', () => {
        beforeAll(() => {
            jest.spyOn(service, 'getLibrary').mockImplementation(
                async (_: string, query: GetContentQuery): Promise<ContentResponse> => {
                    const dto = {
                        name: 'test',
                        description: 'test',
                        author: 'test',
                        price: 1,
                        visibility: Visibility.PUBLISH,
                    };

                    mock.add({ method: 'GET', path: `/${IndexPath.Content}/_search` }, () => ({
                        hits: {
                            hits: [{ _source: dto }],
                        },
                    }));

                    const { hits } = await elasticsearch.search<IContent>({
                        index: IndexPath.Content,
                    });

                    const contents = hits.hits.map((hit) => ({ ...hit._source }));

                    return {
                        page: +query.page,
                        count: query.page * query.size,
                        total: contents.length,
                        payload: contents,
                    };
                },
            );
        });

        afterAll(() => {
            mock.clearAll();
        });

        it('should get a library', async () => {
            const content = await service.getContent(v4(), { size: 1, page: 1 });

            expect(content.page).toEqual(1);
            expect(content.payload).toContainEqual({
                name: 'test',
                description: 'test',
                author: 'test',
                price: 1,
                visibility: 'publish',
            });
        });
    });
});
