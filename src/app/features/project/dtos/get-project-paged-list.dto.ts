import { ProjectTypeEnum } from "../../../core/enums";

export interface IGetProjectPagedListDto {
  id: number;
  name: string;
  description?: string;
  type: ProjectTypeEnum;
  createdAt: string;
  createdByFirstName: string;
  createdByLastName: string;
  createdByFullName: string;

  // Team
  teamId?: number;
  teamName?: string;

  // WorkItem
  totalWorkItem: number;
}