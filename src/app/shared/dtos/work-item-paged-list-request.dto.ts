import { AppUtil } from "../../core/utils/app.util";
import { IPagedListRequestDto, toQueryString } from "./paged-list-request.dto";

export interface IWorkItemPagedListRequestDto extends IPagedListRequestDto {
    parentId?: number | null;
}

export function toWorkItemQueryString(request: IWorkItemPagedListRequestDto): string {
    let query = toQueryString(request);

    if (!AppUtil.isNullOrEmpty(request.parentId?.toString()))
        query += `&parentId=${request.parentId}`;

    return query;
}