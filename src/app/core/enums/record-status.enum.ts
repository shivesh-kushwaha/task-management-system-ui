import { ISelectListItemDto } from "../../shared/dtos";

export enum RecordStatusEnum {
  Active = 1,       // User can log in and use the system normally.
  Inactive = 2,     // User exists but the account is not yet activated or currently not usable.
  Suspended = 3,    // User is temporarily blocked by admin due to violation or investigation.
  Deleted = 4,       // User is soft-deleted and hidden from the system but kept in the database for records.
}

export function getRecordStatusEnum(): ISelectListItemDto[] {
  return Object.keys(RecordStatusEnum)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      key: RecordStatusEnum[key as keyof typeof RecordStatusEnum],
      value: key
    }))
    .sort((a, b) => b.key - a.key);
}