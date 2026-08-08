import { LogTypeEnum, RecordStatusEnum, TypeEnum } from "../../../../core/enums";
import { IGetUserInformationDto } from "../../../../shared/dtos";

export interface IGetExceptionLogByIdDto extends IGetUserInformationDto {
    id: number;
    message: string;
    stackTrace: string;
    logType: LogTypeEnum;
    entityType: TypeEnum;
    description?: string;
    requestUrl?: string;
    requestMethod?: string;
    ipAddress?: string;
    additionalData?: string;
    createdAt: string;
    status: RecordStatusEnum;
    createdByFullName?: string;
    updatedByFullName?: string;
}