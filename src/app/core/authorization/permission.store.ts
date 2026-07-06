export class PermissionStore {
    public static permissions: string[] = [];

    public static setPermissions(permissions: string[]): void {
        this.permissions = permissions;
    }

    public static clearPermissions(): void {
        this.permissions = [];
    }

    public static hasAll(permissions: string[]): boolean {
        return this.permissions.every(x => permissions.includes(x));
    }

    public static hasAny(permissions: string[]): boolean {
        return this.permissions.some(x => permissions.includes(x));
    }
}