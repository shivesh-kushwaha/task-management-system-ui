import { ProjectTypeEnum, RecordStatusEnum } from "../../../core/enums";
import { IGetProjectInformationDto } from "../../../shared/dtos";

export interface IGetProjectByIdDto extends IGetProjectInformationDto {
    id: number;
    name: string;
    type: ProjectTypeEnum;
    description?: string | null;
    status: RecordStatusEnum;
    teamName?: string | null;
    totalWorkItems: number;
}