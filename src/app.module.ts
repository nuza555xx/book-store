import { Module } from '@nestjs/common';
import { BookModule } from '@services/book';
import { BookConfigModule, BookJWTTokenModule } from './commons/modules';
import { BookController } from './controllers/book.controller';
import { MemberController } from './controllers/member.controller';
import { MemberModule } from '@services/member';

@Module({
    imports: [BookConfigModule, BookModule, MemberModule, BookJWTTokenModule],
    controllers: [BookController, MemberController],
    providers: [],
})
export class AppModule {}
