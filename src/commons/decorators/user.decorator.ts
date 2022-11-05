import { ExecutionContext, createParamDecorator, HttpException, HttpStatus } from '@nestjs/common';
import { ITokenPayload } from '@commons/interfaces';
import { Role } from '@services/member';

export class Authorizer {
    constructor(public user: ITokenPayload) {}

    requestAccessForAdmin(): undefined {
        if (this.user.role === Role.ADMIN) return;

        throw new HttpException(
            {
                status: HttpStatus.BAD_REQUEST,
                error: 'Forbidden',
            },
            HttpStatus.BAD_REQUEST,
        );
    }

    requestAccessForMember(): undefined {
        if (this.user.role === Role.MEMBER) return;

        throw new HttpException(
            {
                status: HttpStatus.BAD_REQUEST,
                error: 'Forbidden',
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}
export const Auth = createParamDecorator(async (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.$user;

    return new Authorizer(user);
});
