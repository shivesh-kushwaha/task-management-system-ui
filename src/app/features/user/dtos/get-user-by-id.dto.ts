import { RecordStatusEnum } from "../../../core/enums";
import { IGetUserInformationDto, ISelectListItemDto } from "../../../shared/dtos";

export interface IGetUserByIdDto extends IGetUserInformationDto {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    status: RecordStatusEnum;
    roles: ISelectListItemDto[];
}