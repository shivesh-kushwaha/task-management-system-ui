import { SearchType } from "../../core/enums";

export interface ISearchEventDto {
    query: string;
    type: SearchType
}