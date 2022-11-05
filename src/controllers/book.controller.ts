import {
    BookService,
    CheckoutDto,
    ContentDto,
    ContentResponse,
    GetContentQuery,
    SelectContentDto,
    SettingPointDto,
} from '@services/book';
import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { Auth, Authorizer, BearerAuth } from '@commons/decorators';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'contents' })
@ApiTags('Book')
export class BookController {
    constructor(private book: BookService) {}

    @BearerAuth()
    @Post('create')
    async createContent(@Auth() authorizer: Authorizer, @Body() dto: ContentDto): Promise<void> {
        authorizer.requestAccessForAdmin();
        await this.book.createContent(dto);
    }

    @BearerAuth()
    @Post('settingPoint')
    async createPointSetting(
        @Auth() authorizer: Authorizer,
        @Body() dto: SettingPointDto,
    ): Promise<void> {
        authorizer.requestAccessForAdmin();
        await this.book.createPointSetting(dto);
    }

    @BearerAuth()
    @Put('settingPoint')
    async updatePointSetting(
        @Auth() authorizer: Authorizer,
        @Body() dto: SettingPointDto,
    ): Promise<void> {
        authorizer.requestAccessForAdmin();
        await this.book.updatePointSetting(dto);
    }

    @ApiQuery({ name: 'search', type: String, required: false })
    @ApiQuery({ name: 'page', type: Number, example: 1, required: true })
    @ApiQuery({ name: 'size', type: Number, example: 5, required: true })
    @BearerAuth()
    @Get('list')
    async getContent(
        @Auth() authorizer: Authorizer,
        @Query() query: GetContentQuery,
    ): Promise<ContentResponse> {
        authorizer.requestAccessForMember();
        return this.book.getContent(authorizer.user.id, query);
    }

    @BearerAuth()
    @Post('select-content')
    async selectContent(
        @Auth() authorizer: Authorizer,
        @Body() dto: SelectContentDto,
    ): Promise<void> {
        authorizer.requestAccessForMember();

        return this.book.selectContent(authorizer.user.id, dto);
    }

    @ApiQuery({ name: 'search', type: String, required: false })
    @ApiQuery({ name: 'page', type: Number, example: 1, required: true })
    @ApiQuery({ name: 'size', type: Number, example: 5, required: true })
    @BearerAuth()
    @Get('select-content')
    async getSelectedContent(
        @Auth() authorizer: Authorizer,
        @Query() query: GetContentQuery,
    ): Promise<ContentResponse> {
        authorizer.requestAccessForMember();

        return this.book.getSelectedContent(authorizer.user.id, query);
    }

    @BearerAuth()
    @Post('checkout')
    async checkout(@Auth() authorizer: Authorizer, @Body() dto: CheckoutDto): Promise<void> {
        authorizer.requestAccessForMember();

        return this.book.checkout(authorizer.user.id, dto);
    }
}
