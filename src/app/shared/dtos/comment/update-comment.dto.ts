import { IAddCommentDto } from "./add-comment.dto";

export interface IUpdateCommentDto extends IAddCommentDto {
    id: number;
}