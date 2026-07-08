import { ProjectTypeEnum, RecordStatusEnum } from "../../../core/enums";
import { IGetUserInformationDto } from "../../../shared/dtos";

export interface IGetProjectByIdDto extends IGetUserInformationDto {
    id: number;
    name: string;
    type: ProjectTypeEnum;
    description?: string | null;
    status: RecordStatusEnum;
    teamName?: string | null;
    totalWorkItems: number;
}