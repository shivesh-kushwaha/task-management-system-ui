import { RecordStatusEnum } from "../../../core/enums";
import { ISelectListItemDto } from "../../../shared/dtos";

export interface IGetUserPagedListDto {
    id: number;
    name: string;
    email: string;
    createdById?: number | null;
    createdAt: string;
    status: RecordStatusEnum;
    roles: ISelectListItemDto[];
}