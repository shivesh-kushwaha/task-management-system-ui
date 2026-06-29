export class AuthorizationStore {
    public static permissions: string[] = [];

    public static setPermissions(permissions: string[]): void {
        this.permissions = permissions;
    }

    public static clearPermissions(): void {
        this.permissions = [];
    }
}