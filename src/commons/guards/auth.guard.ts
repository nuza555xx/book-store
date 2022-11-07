import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { IJWTConfig, ITokenPayload } from '@commons/interfaces';

type AuthRequest = FastifyRequest & {
    $user: ITokenPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private jwtService: JwtService, private configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const token = request.headers.authorization?.replace(/^bearer /i, '');
        if (!token)
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Missing authorization header',
                },
                HttpStatus.UNAUTHORIZED,
            );
        try {
            const payload = this.verifyToken(token);

            request.$user = payload;
            return true;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: 'Invalid token or expired',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }

    private verifyToken(token: string): ITokenPayload {
        const { jwtSecret } = this.configService.get<IJWTConfig>('jwt');

        return this.jwtService.verify(token, {
            secret: jwtSecret,
        });
    }
}
