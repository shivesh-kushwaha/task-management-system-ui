export enum RecordStatusEnum {
  Active = 1,       // User can log in and use the system normally.
  Inactive = 2,     // User exists but the account is not yet activated or currently not usable.
  Suspended = 3,    // User is temporarily blocked by admin due to violation or investigation.
  Deleted = 4       // User is soft-deleted and hidden from the system but kept in the database for records.
}