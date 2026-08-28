import { TypeEnum } from "../../../core/enums";
import { IPagedListRequestDto, toQueryString as baseToQueryString } from "../paged-list-request.dto";

export interface IGetCommentPagedListRequestDto extends IPagedListRequestDto {
    type: TypeEnum,
    typeId: number
}

export function toCommentQueryString(request: IGetCommentPagedListRequestDto): string {
    const baseParams = new URLSearchParams(baseToQueryString(request));
    baseParams.append('type', request.type.toString());
    baseParams.append('typeId', request.typeId.toString());

    return baseParams.toString();
}