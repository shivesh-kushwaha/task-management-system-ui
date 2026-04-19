import { IAddProjectDto } from "./add-project.dto";

export interface IUpdateProjectDto extends IAddProjectDto {
    id: number;
}