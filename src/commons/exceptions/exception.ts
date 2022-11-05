import { HttpException, HttpStatus } from '@nestjs/common';

export class BookException<T = unknown> extends Error {
    constructor(private code: HttpStatus, private payload: T) {
        super();
    }

    getLocalizedException(): HttpException {
        return new HttpException(
            {
                statusCode: this.code.toString(),
                message: this.payload,
            },
            Number(this.code),
        );
    }
}
