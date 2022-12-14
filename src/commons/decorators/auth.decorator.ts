import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

export function BearerAuth(): MethodDecorator {
    return applyDecorators(ApiBearerAuth('JWT-auth'), UseGuards(AuthGuard));
}
