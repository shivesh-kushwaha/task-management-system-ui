export interface IAddUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    roles: number[];
}