import { LoginDto, RegisterDto } from './member.dto';
import { MemberResponse } from './member.interface';

export abstract class MemberService {
    abstract register(dto: RegisterDto): Promise<{ accessToken: string }>;
    abstract login(dto: LoginDto): Promise<{ accessToken: string }>;
    abstract me(userId: string): Promise<MemberResponse>;
}
