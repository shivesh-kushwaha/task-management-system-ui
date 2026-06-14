import { IAddWorkItemDto } from "./add-work-item.dto";

export interface IUpdateWorkItemDto extends IAddWorkItemDto {
    id: number;
}