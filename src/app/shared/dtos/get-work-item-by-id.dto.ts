import { RecordStatusEnum, WorkItemPriorityEnum } from "../../core/enums";
import { IGetProjectInformationDto } from "./get-project-information.dto";

export interface IGetWorkItemByIdDto extends IGetProjectInformationDto {
    id: 0;
    parentId?: number | null;
    parentName?: string | null;
    title: '';
    description?: string | null;
    type?: string | null;
    assignedToId?: number | null;
    assignedToName?: string | null;
    dueDate: string;
    createadAt: string;
    status: RecordStatusEnum;
    priority: WorkItemPriorityEnum;
    projectId?: number | null;
    projectName?: string | null;
    totalSubTasks: number;
}