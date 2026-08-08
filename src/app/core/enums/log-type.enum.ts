import { ISelectListItemDto } from "../../shared/dtos";

export enum LogTypeEnum {
    Information = 1,
    Warning = 2,
    Error = 3,
}

export function getLogTypeEnum(): ISelectListItemDto[] {
    return Object.keys(LogTypeEnum)
        .filter(key => isNaN(Number(key)))
        .map(key => ({
            key: LogTypeEnum[key as keyof typeof LogTypeEnum],
            value: key
        }))
        .sort((a, b) => b.key - a.key);
}