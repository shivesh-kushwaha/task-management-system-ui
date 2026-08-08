import { LogTypeEnum, RecordStatusEnum, TypeEnum } from "../../../../core/enums";

export interface IGetExceptionLogPagedListDto {
    id: number;
    message: string;
    stackTrace: string;
    logType: LogTypeEnum;
    entityType: TypeEnum;
    description: string;
    requestUrl: string;
    requestMethod: string;
    ipAddress: string;
    additionalData: string;
    createdAt: Date;
    status: RecordStatusEnum;
    createdByFirstName: string;
    createdByLastName: string;
    updatedByFirstName: string;
    updatedByLastName: string;
    createdByFullName?: string; // computed
}