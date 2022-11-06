import { BookElasticModule, BookRedisModule } from '../../commons/modules';
import { Module } from '@nestjs/common';
import { BookService } from './book.abstract';
import { BookServiceImpl } from './book.implement';

@Module({
    imports: [BookElasticModule, BookRedisModule],
    providers: [
        {
            provide: BookService,
            useClass: BookServiceImpl,
        },
    ],
    exports: [BookService],
})
export class BookModule {}

export { BookService };
