export interface IGetUserInformationDto {
    createdAt: string;
    createdById?: number | null;
    createdByFirstName?: string | null;
    createdByLastName?: string | null;
    
    updatedAt?: string | null;
    updatedById?: number | null;
    updatedByFirstName?: string | null;
    updatedByLastName?: string | null;
}