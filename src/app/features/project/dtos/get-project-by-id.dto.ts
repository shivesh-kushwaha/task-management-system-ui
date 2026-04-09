import { ProjectTypeEnum, RecordStatusEnum } from "../../../core/enums";
import { IGetProjectInformationDto } from "../../../shared/dtos";

export interface IGetProjectByIdDto extends IGetProjectInformationDto {
    id: number;
    name: string;
    type: ProjectTypeEnum;
    description?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    status: RecordStatusEnum;
    teamName?: string | null;
    totalWorkItems: number;
    createdById?: number | null;
    updatedById?: number | null;
}