export interface IGetProjectInformationDto {
    createdAt: string;
    createdById?: number | null;
    createdByFirstName: string;
    createdByLastName?: string | null;
    
    updatedAt?: string | null;
    updatedById?: number | null;
    updatedByFirstName?: string | null;
    updatedByLastName?: string | null;
}