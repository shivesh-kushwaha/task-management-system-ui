import { LogTypeEnum, TypeEnum } from "../../../../core/enums";
import { IPagedListRequestDto, toQueryString as baseToQueryString } from "../../../../shared/dtos";

export interface IGetExceptionLogPagedListRequestDto extends IPagedListRequestDto {
    logType?: LogTypeEnum | null;
    entityType?: TypeEnum | null;
    fromDate?: string | null;
    toDate?: string | null;
}

export function toExceptionLogQueryString(request: IGetExceptionLogPagedListRequestDto): string {
    const baseParams = new URLSearchParams(baseToQueryString(request));

    if (request.logType !== null && request.logType !== undefined) {
        baseParams.append('logType', request.logType.toString());
    }

    if (request.entityType !== null && request.entityType !== undefined) {
        baseParams.append('entityType', request.entityType.toString());
    }

    if (request.fromDate) {
        baseParams.append('fromDate', request.fromDate);
    }

    if (request.toDate) {
        baseParams.append('toDate', request.toDate);
    }

    return baseParams.toString();
}