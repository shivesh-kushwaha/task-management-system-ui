import { IPagedListRequestDto } from "./paged-list-request.dto";

export interface ITaskPagedListRequestDto extends IPagedListRequestDto {
    parentId?: number | null;
}