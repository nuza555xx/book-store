import { LoginDto, RegisterDto } from './member.dto';
import { AccessTokenResponse, MemberResponse } from './member.interface';

export abstract class MemberService {
    abstract register(dto: RegisterDto): Promise<AccessTokenResponse>;
    abstract login(dto: LoginDto): Promise<AccessTokenResponse>;
    abstract me(userId: string): Promise<MemberResponse>;
}
