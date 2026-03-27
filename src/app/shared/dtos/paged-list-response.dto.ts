export interface IPagedListResponseDto<T>{
    items: Array<T>;
    totalCount: number;
}