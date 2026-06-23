import { RecordStatusEnum } from "../../../core/enums";
import { ISelectListItemDto } from "../../../shared/dtos";

export interface IGetUserPagedListDto {
    id: number;
    firstName: string;
    lastName?: string | null;
    name: string;
    email: string;
    phoneNumber: string;
    createdById?: number | null;
    createdAt: string;
    status: RecordStatusEnum;
    roles: ISelectListItemDto[];
}