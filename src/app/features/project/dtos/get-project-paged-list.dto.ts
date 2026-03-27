import { ProjectTypeEnum } from "../../../core/enums";

export interface IGetProjectPagedListDto {
  id: number;
  name: string;
  description?: string;
  type: ProjectTypeEnum;
  createdByFirstName: string;
  createdByLastName: string;

  // Team
  teamId?: number;
  teamName?: string;

  // WorkItem
  totalWorkItem: number;
}