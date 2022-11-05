import { Role } from '@services/member';

export interface ITokenPayload {
    id: string;
    role: Role;
}
