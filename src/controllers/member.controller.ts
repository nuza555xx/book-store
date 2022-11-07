import { Auth, Authorizer, BearerAuth } from '../commons/decorators';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookService, ContentResponse, GetContentQuery } from '@services/book';
import {
    AccessTokenResponse,
    LoginDto,
    MemberResponse,
    MemberService,
    RegisterDto,
} from '@services/member';

@Controller({ path: 'members' })
@ApiTags('Member')
export class MemberController {
    constructor(private member: MemberService, private book: BookService) {}

    @Post('login')
    async login(@Body() dto: LoginDto): Promise<AccessTokenResponse> {
        return this.member.login(dto);
    }

    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<AccessTokenResponse> {
        return this.member.register(dto);
    }

    @Get('')
    @BearerAuth()
    async me(@Auth() authorizer: Authorizer): Promise<MemberResponse> {
        authorizer.requestAccessForMember();
        return this.member.me(authorizer.user.id);
    }

    @ApiQuery({ name: 'search', type: String, required: false })
    @ApiQuery({ name: 'page', type: Number, example: 1, required: true })
    @ApiQuery({ name: 'size', type: Number, example: 5, required: true })
    @BearerAuth()
    @Get('library')
    async getLibrary(
        @Auth() authorizer: Authorizer,
        @Query() query: GetContentQuery,
    ): Promise<ContentResponse> {
        authorizer.requestAccessForMember();
        return this.book.getLibrary(authorizer.user.id, query);
    }
}
