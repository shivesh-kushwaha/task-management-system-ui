export interface IGetWorkItemListByIdDto {
    workItemId: number;
    workitemName: string;
    workItemParentId?: number | null;
    projectId?: number | null;
    projectName?: string | null;
}