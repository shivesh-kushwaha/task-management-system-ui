import { ISelectListItemDto } from "../../shared/dtos/select-list-item.dto";

export enum ProjectTypeEnum {
  Individual = 1,
  Team = 2
}

export function getProjectTypes(): ISelectListItemDto[] {
  return [
    { key: ProjectTypeEnum.Individual, value: 'Individual'},
    { key: ProjectTypeEnum.Team, value: 'Team'},
  ]
}