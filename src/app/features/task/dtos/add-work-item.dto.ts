export interface IAddWorkItemDto {
    projectId?: number | null;
    parentId?: number | null;
    title: string;
    description?: string | null;
    typeId?: number | null;
    type?: string | null;
    assignedToId?: number | null;
    dueDate: string | string;
}