import { BookElasticModule, BookJWTTokenModule, BookRedisModule } from '@commons/modules';
import { Module } from '@nestjs/common';
import { MemberService } from './member.abstract';
import { MemberServiceImpl } from './member.implement';

@Module({
    imports: [BookElasticModule, BookRedisModule, BookJWTTokenModule],
    providers: [
        {
            provide: MemberService,
            useClass: MemberServiceImpl,
        },
    ],
    exports: [MemberService],
})
export class MemberModule {}

export { MemberService };
