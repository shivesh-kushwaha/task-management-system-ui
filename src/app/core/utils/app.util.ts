import { IPagedListRequestDto } from "../../shared/dtos";

export class AppUtil {
    public static EmptyString = '';
    public static DefaultSearch = 'Search...';
    public static DefaultPageSize = 25;
    public static DefaultPageIndex = 0;
    public static DefaultSortOrder = 'asc';
    public static AscendingOrder = 'asc';
    public static DescendingOrder = 'desc';
    public static DefaultValue = 'N/A';
    public static DefaultPageSizeOptions = [5, 10, 25, 50];

    // Dialog
    public static DefaultDeletDialogeHeading = 'Delete';
    public static DefaultConfirmDialogHeading = 'Confirm';
    public static DefaultDeleteDialogMessage = 'Are you sure you want to delete the selected';

    public static isNullOrEmpty(value: string): boolean {
        return value === undefined || value === null || value === '';
    }

    public static initializePagedListRequest(sort: string): IPagedListRequestDto {
        return {
            filterKey: AppUtil.EmptyString,
            sort: sort,
            order: AppUtil.DefaultSortOrder,
            pageIndex: AppUtil.DefaultPageIndex,
            pageSize: AppUtil.DefaultPageSize,
        };
    }

    public static getDefaultDeleteDialogMessage(title: string): string {
        return `${this.DefaultDeleteDialogMessage} ${title}`;
    }
}