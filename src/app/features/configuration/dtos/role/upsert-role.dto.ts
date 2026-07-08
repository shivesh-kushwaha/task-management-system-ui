export interface IUpsertRoleDto {
    id?: number | null;
    name: string;
    code: string;
    description?: string | null;
}