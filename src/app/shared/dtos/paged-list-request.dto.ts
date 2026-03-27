export interface IPagedListRequestDto {
    filterKey?: string;
    sort: string;
    order: string;
    pageIndex: number;
    pageSize: number;
}

export function toQueryString(request: IPagedListRequestDto): string {
    const params = new URLSearchParams();

    if (request.filterKey) {
        params.append('filterKey', request.filterKey);
    }

    if (request.sort) {
        params.append('sort', request.sort);
    }

    if (request.order) {
        params.append('order', request.order);
    }

    params.append('pageIndex', request.pageIndex.toString());
    params.append('pageSize', request.pageSize.toString());

    return params.toString();
}