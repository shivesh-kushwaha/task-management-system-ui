import { RecordStatusEnum, WorkItemPriorityEnum } from "../../../core/enums";

export interface IGetWorkItemPagedListDto {
  id: number;
  title: string;
  description?: string | null;
  type?: string | null;
  dueDate: string | Date;
  createdAt: string | Date;
  status: RecordStatusEnum;
  priority: WorkItemPriorityEnum;
  createdByFullName: string;
  totalSubTasks: number;
  projectId?: number | null;
  parentId?: number | null;
  assignedToId?: number | null;
}