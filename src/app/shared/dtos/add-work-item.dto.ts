export interface IAddWorkItemDto {
    projectId?: number | null;
    parentId?: number | null;
    title: string;
    description?: string | null;
    typeId: number;
    assignedToId?: number | null;
    dueDate: string | string;
}