import { LoginDto, RegisterDto } from './member.dto';

export abstract class MemberService {
    abstract register(dto: RegisterDto): Promise<{ accessToken: string }>;
    abstract login(dto: LoginDto): Promise<{ accessToken: string }>;
}
