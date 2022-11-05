import { PaymentMethod, PointEnabled, Visibility } from './book.enum';

export interface IContent {
    id?: string;
    name: string;
    description: string;
    author: string;
    price: number;
    visibility: Visibility;
}

export class ISelectContent {
    contentId: string[];
}

export interface ISettingPoint {
    enabled: PointEnabled;
    oneTo: number;
}

export interface ITransaction {
    balance: number;
    contentId: string[];
    userId: string;
    paymentMethod: PaymentMethod;
}

export interface ContentResponse {
    page: number;
    count: number;
    total: number;
    payload: IContent[];
}
