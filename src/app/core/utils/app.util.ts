export class AppUtil {
    public static EmptyString = '';
    public static DefaultSearch = 'Search...';
    public static DefaultPageSize = 20;

    public static isNullOrEmpty(value: string): boolean {
        return value === undefined || value === null || value === '';
    }
}