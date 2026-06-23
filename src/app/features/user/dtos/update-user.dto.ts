export interface IUpdateUserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    roles: number[];
}