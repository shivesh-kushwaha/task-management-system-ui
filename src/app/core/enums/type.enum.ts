import { ISelectListItemDto } from "../../shared/dtos";

export enum TypeEnum {
    Project = 1,
    Team = 2,
    WorkItem = 3,
    User = 4,
    Comment,
    Other = 100
}

export function getTypeEnum(): ISelectListItemDto[] {
    return Object.keys(TypeEnum)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            key: TypeEnum[key as keyof typeof TypeEnum],
            value: key
        }))
        .sort((a, b) => b.key - a.key);
}