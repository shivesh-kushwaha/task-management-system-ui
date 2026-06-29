import { ISelectListItemDto } from "../../../../shared/dtos";

export interface IGetPermissionListItemDto extends ISelectListItemDto {
    isChecked: boolean;
}