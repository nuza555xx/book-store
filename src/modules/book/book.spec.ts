import { Test, TestingModule } from '@nestjs/testing';
import { BookService, BookServiceImpl } from './book.implement';

describe('BookService', () => {
    let service: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: BookService,
                    useClass: BookServiceImpl,
                },
            ],
        }).compile();

        service = module.get<BookService>(BookService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
