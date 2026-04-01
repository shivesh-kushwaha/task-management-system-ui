import { ProjectTypeEnum } from "../../../core/enums";

export interface IUpdateProjectDto {
  id: number;
  name: string;
  description?: string | null;
  type: ProjectTypeEnum;
  teamId?: number | null;
}