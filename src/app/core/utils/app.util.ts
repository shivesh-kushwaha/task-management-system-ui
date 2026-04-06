export class AppUtil {
    public static EmptyString = '';
    public static DefaultSearch = 'Search...';
    public static DefaultPageSize = 20;
    public static DefaultPageIndex = 0;
    public static DefaultSortOrder = 'asc';
    public static AscendingOrder = 'asc';
    public static DescendingOrder = 'desc';
    public static DefaultValue = 'N/A';

    public static isNullOrEmpty(value: string): boolean {
        return value === undefined || value === null || value === '';
    }
}