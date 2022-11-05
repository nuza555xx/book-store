import { IndexPath } from '@commons/enums';
import { BookException } from '@commons/exceptions';

import {
    ContentResponse,
    IContent,
    ISelectContent,
    ISettingPoint,
    ITransaction,
} from './book.interface';
import {
    CheckoutDto,
    ContentDto,
    GetContentQuery,
    SelectContentDto,
    SettingPointDto,
} from './book.dto';

import { QueryDslQueryContainer, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { CACHE_MANAGER, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { BookService } from './book.abstract';
import { PaymentMethod, PointEnabled, Visibility } from './book.enum';

import { v4 } from 'uuid';
import { Cache } from 'cache-manager';
import { uniqBy } from 'lodash';
import { IMember } from '../member';

@Injectable()
export class BookServiceImpl implements BookService {
    constructor(
        private readonly elasticsearch: ElasticsearchService,
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}

    private _setQueryContent({ search }: { search: string }): QueryDslQueryContainer[] {
        const query: QueryDslQueryContainer[] = [];

        if (search) query.push({ match: { name: search } });

        query.push({ match: { visibility: Visibility.PUBLISH } });

        return query;
    }

    private _aggregateContent({ search, size, page }: GetContentQuery): SearchRequest {
        const aggregate: SearchRequest = {
            index: IndexPath.Content,
            query: {
                bool: {
                    must: this._setQueryContent({ search }) ?? [],
                },
            },
        };

        if (size) aggregate.size = size;
        if (page) aggregate.from = (Number(page) - 1) * size;

        return aggregate;
    }

    async createPointSetting(dto: SettingPointDto): Promise<void> {
        try {
            const {
                hits: { hits },
            } = await this.elasticsearch.search<ISettingPoint>({
                index: IndexPath.SettingPoint,
                query: { match_all: {} },
            });

            const [payload] = hits;

            if (payload)
                throw new BookException(
                    HttpStatus.BAD_REQUEST,
                    'Setting is existing. Please try again.',
                );

            await this.elasticsearch.index({
                index: IndexPath.SettingPoint,
                id: v4(),
                document: dto,
            });
        } catch (error) {
            if (error.statusCode !== 404) throw error;

            await this.elasticsearch.index({
                index: IndexPath.SettingPoint,
                id: v4(),
                document: dto,
            });
        }
    }

    async updatePointSetting(dto: SettingPointDto): Promise<void> {
        try {
            await this.elasticsearch.updateByQuery({
                index: IndexPath.Member,
                query: { match_all: {} },
                script: {
                    lang: 'painless',
                    source: `ctx._source["enabled"] = params.enabled; ctx._source["oneTo"] = params.oneTo;`,
                    params: dto,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async createContent(dto: ContentDto): Promise<void> {
        await this.elasticsearch.index({
            index: IndexPath.Content,
            id: v4(),
            document: dto,
        });
    }

    async getContent(userId: string, query: GetContentQuery): Promise<ContentResponse> {
        const { hits: transactionHits } = await this.elasticsearch.search<ITransaction>({
            index: IndexPath.Transaction,
            query: {
                bool: { must: { match: { userId } } },
            },
        });

        const contentIds = transactionHits.hits.flatMap(({ _source }) => _source.contentId);

        const aggregate = this._aggregateContent(query);

        if (contentIds.length) aggregate.query.bool.filter = { ids: { values: contentIds } };

        const { hits: contentHits } = await this.elasticsearch.search<IContent>(aggregate);

        const contents = contentHits.hits
            .map((hit) => ({ id: hit._id, ...hit._source }))
            .filter(({ id }) => !contentIds.includes(id));
        return {
            page: +query.page,
            count: query.page * query.size,
            total: contents.length,
            payload: contents,
        };
    }

    async selectContent(userId: string, dto: SelectContentDto): Promise<void> {
        const cacheKey = `${userId}-cart`;

        let store = await this.cache.get(cacheKey);
        if (!store) await this.cache.set(cacheKey, JSON.stringify(dto));

        store = await this.cache.get(cacheKey);

        const { contentId }: ISelectContent = JSON.parse(store as string);

        const flat = [contentId ?? [], dto.contentId].flatMap((id) => id);

        const unique = uniqBy(flat, 2);
        await this.cache.set(cacheKey, JSON.stringify({ contentId: unique }));
    }

    async getSelectedContent(userId: string, query: GetContentQuery): Promise<ContentResponse> {
        const cacheKey = `${userId}-cart`;

        const store = await this.cache.get(cacheKey);

        if (!store)
            return {
                page: +query.page,
                count: query.page * query.size,
                total: 0,
                payload: [],
            };

        const { contentId }: ISelectContent = JSON.parse(store as string);

        const { hits: contentHits } = await this.elasticsearch.search<IContent>({
            index: IndexPath.Content,
            query: {
                bool: {
                    must: [{ match: { visibility: Visibility.PUBLISH } }],
                    filter: { ids: { values: contentId } },
                },
            },
        });

        const contents = contentHits.hits.map((hit) => ({
            id: hit._id,
            ...hit._source,
        }));

        return {
            page: +query.page,
            count: query.page * query.size,
            total: contents.length,
            payload: contents,
        };
    }

    async checkout(userId: string, dto: CheckoutDto): Promise<void> {
        const cacheKey = `${userId}-cart`;
        const store = await this.cache.get(cacheKey);
        if (!store)
            throw new BookException(HttpStatus.NOT_FOUND, 'Cart is empty. Please check again');

        const { contentId }: ISelectContent = JSON.parse(store as string);

        const { hits: memberHits } = await this.elasticsearch.search<IMember>({
            index: IndexPath.Member,
            query: {
                bool: {
                    filter: { ids: { values: userId } },
                },
            },
        });
        const [{ _source: sourceMember }] = memberHits.hits;
        if (!sourceMember) throw new BookException(HttpStatus.NOT_FOUND, 'Member not found');

        const { hits: contentHits } = await this.elasticsearch.search<IContent>({
            index: IndexPath.Content,
            query: {
                bool: {
                    must: [{ match: { visibility: Visibility.PUBLISH } }],
                    filter: { ids: { values: contentId } },
                },
            },
        });

        const contents = contentHits.hits.map((hit) => {
            return { id: hit._id, ...hit._source };
        });

        const balance = contents.reduce((previousValue, { price }) => previousValue + price, 0);

        const prepare = {
            balance,
            contentId,
            userId,
            paymentMethod: dto.method,
        };

        const { hits: settingHits } = await this.elasticsearch.search<ISettingPoint>({
            index: IndexPath.SettingPoint,
            query: { match_all: {} },
        });

        const [{ _source: sourceSetting }] = settingHits.hits;

        if (dto.method === PaymentMethod.Point) {
            if (sourceSetting?.enabled === PointEnabled.ACTIVE) {
                const deductPoint = sourceMember.point - balance;

                if (deductPoint < 0)
                    throw new BookException(HttpStatus.BAD_REQUEST, 'Insufficient balance');

                await this.elasticsearch.update({
                    index: IndexPath.Member,
                    id: userId,
                    body: {
                        doc: { point: deductPoint },
                    },
                });
            } else {
                throw new BookException(HttpStatus.BAD_REQUEST, 'No enabled point redeem');
            }
        } else {
            const addPoint = sourceSetting.enabled ? balance * sourceSetting.oneTo : balance;
            await this.elasticsearch.update({
                index: IndexPath.Member,
                id: userId,
                body: { doc: { point: addPoint } },
            });
        }

        await Promise.all([
            this.cache.del(cacheKey),
            this.elasticsearch.index({
                index: IndexPath.Transaction,
                id: v4(),
                document: prepare,
            }),
        ]);
    }

    async getLibrary(userId: string, query: GetContentQuery): Promise<ContentResponse> {
        const { hits: transactionHits } = await this.elasticsearch.search<ITransaction>({
            index: IndexPath.Transaction,
            query: { bool: { must: { match: { userId } } } },
        });

        const contentIds = transactionHits.hits.flatMap(({ _source }) => _source.contentId);

        const aggregate = this._aggregateContent(query);

        if (contentIds.length) aggregate.query.bool.filter = { ids: { values: contentIds } };

        const { hits: contentHits } = await this.elasticsearch.search<IContent>(aggregate);

        const contents = contentHits.hits.map((hit) => ({
            id: hit._id,
            ...hit._source,
        }));

        return {
            page: +query.page,
            count: query.page * query.size,
            total: contents.length,
            payload: contents,
        };
    }
}
