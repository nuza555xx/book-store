import { IJWTConfig } from '@commons/interfaces';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from './member.abstract';
import { LoginDto, RegisterDto } from './member.dto';
import { IMember } from './member.interface';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { IndexPath } from '@commons/enums';
import { BookException } from '@commons/exceptions';

const saltOrRounds = 10;

@Injectable()
export class MemberServiceImpl implements MemberService {
    constructor(
        private readonly elasticsearch: ElasticsearchService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) {}

    private readonly logger = new Logger(MemberService.name);

    private _generateToken(payload: IMember): { accessToken: string } {
        const { jwtSecret, accessTokenExpiration } = this.config.get<IJWTConfig>('jwt');

        const token = this.jwt.sign(
            { id: payload.id, role: payload.role },
            { secret: jwtSecret, expiresIn: accessTokenExpiration },
        );

        return { accessToken: token };
    }

    async register({
        username,
        password,
        role,
        displayName,
    }: RegisterDto): Promise<{ accessToken: string }> {
        const hashPassword = await bcrypt.hash(password, saltOrRounds);
        const uuid = v4();
        const prepare = {
            role,
            username,
            displayName,
            id: uuid,
            point: 0,
            password: hashPassword,
        };

        try {
            const {
                hits: { hits: memberHits },
            } = await this.elasticsearch.search<IMember>({
                index: IndexPath.Member,
                query: { bool: { must: [{ match: { username } }] } },
            });

            const [payload] = memberHits;

            if (payload)
                throw new BookException(
                    HttpStatus.BAD_REQUEST,
                    'Username is existing. Please try again.',
                );

            await this.elasticsearch.index({
                index: IndexPath.Member,
                id: `${uuid}`,
                document: prepare,
            });
        } catch (error) {
            this.logger.error(JSON.stringify(error));
            if (error.statusCode !== 404) throw error;

            await this.elasticsearch.index({
                index: IndexPath.Member,
                id: `${uuid}`,
                document: prepare,
            });
        }

        return this._generateToken(prepare);
    }

    async login({ username, password }: LoginDto): Promise<{ accessToken: string }> {
        try {
            const {
                hits: { hits: memberHits },
            } = await this.elasticsearch.search<IMember>({
                index: IndexPath.Member,
                query: { bool: { must: [{ match: { username } }] } },
            });

            const [payload] = memberHits;

            if (!payload) throw new BookException(HttpStatus.NOT_FOUND, 'Username not found');

            const compare = bcrypt.compare(password, payload._source.password);

            if (!compare)
                throw new BookException(HttpStatus.BAD_REQUEST, 'Password does not match');

            return this._generateToken(payload._source);
        } catch (error) {
            this.logger.error(JSON.stringify(error));

            if (error.statusCode !== 404) throw error;
        }
    }
}
