export interface IGetProjectInformationDto {
    createdByFirstName: string;
    createdByLastName?: string | null;
    updatedByFirstName?: string | null;
    updatedByLastName?: string | null;
}