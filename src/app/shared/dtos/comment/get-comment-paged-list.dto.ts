import { TypeEnum } from '../../../core/enums';
import { RecordStatusEnum } from '../../../core/enums';

export interface IGetCommentPagedListDto {
    id: number;
    description: string;
    type: TypeEnum;
    typeId: number;
    status: RecordStatusEnum;
    createdAt: string;
    createdById?: number | null;
    updatedAt?: string | null;
    updatedById?: number | null;
    deletedAt?: string | null;
    deletedById?: number | null;
    createdByFirstName?: string | null;
    createdByLastName?: string | null;

    // Extra properties
    isLoggedUser: boolean;
}