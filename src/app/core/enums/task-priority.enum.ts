import { ISelectListItemDto } from "../../shared/dtos";

export enum WorkItemPriorityEnum {
  Low = 1,
  Normal = 2,
  Medium = 3,
  High = 4,
  Critical = 5,
}

export function getWorkItemPriorityEnum(): ISelectListItemDto[] {
  return Object.keys(WorkItemPriorityEnum)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      key: WorkItemPriorityEnum[key as keyof typeof WorkItemPriorityEnum],
      value: key
    }))
    .sort((a, b) => b.key - a.key);
}