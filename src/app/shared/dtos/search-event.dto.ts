import { SearchTypeEnum } from "../../core/enums";

export interface ISearchEventDto {
    query: string;
    type: SearchTypeEnum
}