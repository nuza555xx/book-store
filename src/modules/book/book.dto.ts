import { PaymentMethod, PointEnabled, Visibility } from '@services/book';
import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

export class ContentDto {
    @ApiProperty({
        name: 'name',
        example: 'example',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        name: 'description',
        example: 'example',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        name: 'author',
        example: 'example',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    author: string;

    @ApiProperty({
        name: 'price',
        example: 100,
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        name: 'visibility',
        example: 'example',
        required: true,
        enum: Visibility,
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(Visibility)
    visibility: Visibility;
}

export class SelectContentDto {
    @ApiProperty({
        name: 'contentId',
        example: ['example'],
        required: true,
        type: Array,
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('all', { each: true })
    @ArrayMinSize(1)
    contentId: string[];
}

export class CheckoutDto {
    @ApiProperty({
        name: 'method',
        example: 'example',
        required: true,
        enum: PaymentMethod,
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}

export class SettingPointDto {
    @ApiProperty({
        name: 'enabled',
        example: 'active',
        required: true,
        enum: PointEnabled,
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(PointEnabled)
    enabled: PointEnabled;

    @ApiProperty({
        name: 'oneTo',
        example: 1,
        required: true,
        type: Number,
    })
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    oneTo: number;
}

export class GetContentQuery {
    @ApiProperty({
        name: 'search',
        example: 'example',
        type: String,
    })
    @IsString()
    @IsOptional()
    search?: string;

    @ApiProperty({
        name: 'size',
        example: 5,
        type: Number,
    })
    @IsNumberString()
    @IsNotEmpty()
    size: number;

    @ApiProperty({
        name: 'page',
        example: 1,
        type: Number,
    })
    @IsNumberString()
    @IsNotEmpty()
    page: number;
}
