import { Role } from './member.enum';

export interface IMember {
    id: string;
    username: string;
    password: string;
    displayName: string;
    point?: number;
    role: Role;
}
