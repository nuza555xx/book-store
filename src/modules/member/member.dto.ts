import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from './member.enum';

export class RegisterDto {
    @ApiProperty({
        name: 'username',
        example: 'testing',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        name: 'displayName',
        example: 'testing testing',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    displayName: string;

    @ApiProperty({
        name: 'password',
        example: '12345678',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        name: 'role',
        example: Role.MEMBER,
        required: true,
        enum: Role,
    })
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;
}

export class LoginDto {
    @ApiProperty({
        name: 'username',
        example: 'example',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        name: 'password',
        example: '12345678',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}
