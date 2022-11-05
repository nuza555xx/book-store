import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BookException } from './exception';
import { FastifyReply } from 'fastify';

@Catch(BookException)
export class BookExceptionFilter implements ExceptionFilter {
    private logger = new Logger(BookExceptionFilter.name);

    catch(exception: BookException, host: ArgumentsHost): FastifyReply {
        this.logger.error(JSON.stringify(exception));

        const ctx = host.switchToHttp();
        const localizedException = exception.getLocalizedException();

        return ctx
            .getResponse<FastifyReply>()
            .status(localizedException.getStatus())
            .send(localizedException.getResponse());
    }
}
