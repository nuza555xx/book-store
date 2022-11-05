import {
    CheckoutDto,
    ContentDto,
    GetContentQuery,
    SelectContentDto,
    SettingPointDto,
} from './book.dto';
import { ContentResponse } from './book.interface';

export abstract class BookService {
    abstract createPointSetting(dto: SettingPointDto): Promise<void>;
    abstract updatePointSetting(dto: SettingPointDto): Promise<void>;
    abstract createContent(dto: ContentDto): Promise<void>;
    abstract getContent(userId: string, query: GetContentQuery): Promise<ContentResponse>;

    abstract selectContent(userId: string, dto: SelectContentDto): Promise<void>;

    abstract getSelectedContent(userId: string, query: GetContentQuery): Promise<ContentResponse>;

    abstract checkout(userId: string, dto: CheckoutDto): Promise<void>;

    abstract getLibrary(userId: string, query: GetContentQuery): Promise<ContentResponse>;
}
