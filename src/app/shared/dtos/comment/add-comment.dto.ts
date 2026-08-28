import { TypeEnum } from "../../../core/enums";

export interface IAddCommentDto {
    description: string;
    type: TypeEnum;
    typeId: number;
}