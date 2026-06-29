import { ISelectListItemDto } from "../../../shared/dtos";

export interface IGetDashboardDto {
    totalProject: number;
    totalTask: number;
    totalUser: number;
    totalTeam: number;
    tasks: ISelectListItemDto[];
}