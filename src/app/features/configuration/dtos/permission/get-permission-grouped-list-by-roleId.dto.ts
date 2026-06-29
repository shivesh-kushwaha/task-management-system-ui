import { IGetPermissionListItemDto } from "./get-permission-list-item.dto";

export interface IGetPermissionGroupedListByRoleIdDto {
    isCollapsed: boolean;
    isAllPermissionChecked: boolean;
    permissionGroupId: number;
    permissionGroupName: string;
    permissions: IGetPermissionListItemDto[];
}