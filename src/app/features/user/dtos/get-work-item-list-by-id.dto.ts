export interface IGetWorkItemListByIdDto {
    workItemId: number;
    workItemName: string;
    workItemParentId?: number | null;
    projectId?: number | null;
    projectName?: string | null;
}