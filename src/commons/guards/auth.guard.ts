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
    constructor(private jwtService: JwtService, private configService: ConfigService) {}
    private readonly logger = new Logger(AuthGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const token = request.headers.authorization?.replace(/^bearer /i, '');
        if (!token)
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: 'Missing authorization header',
                },
                HttpStatus.FORBIDDEN,
            );
        try {
            const payload = this.verifyToken(token);

            request.$user = payload;
            return true;
        } catch (err) {
            this.logger.error(err);
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: 'Invalid token or expired',
                },
                HttpStatus.FORBIDDEN,
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
