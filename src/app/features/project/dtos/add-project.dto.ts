import { ProjectTypeEnum } from "../../../core/enums";

export interface IAddProjectDto {
  name: string;
  description: string | null;
  type: ProjectTypeEnum;
  teamId: number | null;
}