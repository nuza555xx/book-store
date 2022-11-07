import { Role } from './member.enum';

export interface IMember {
    id: string;
    username: string;
    password: string;
    displayName: string;
    point?: number;
    role: Role;
}
export interface MemberResponse {
    id: string;
    username: string;
    displayName: string;
    point?: number;
    role: Role;
}

export interface AccessTokenResponse {
    accessToken: string;
}
