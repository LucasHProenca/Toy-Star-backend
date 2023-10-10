import { UserModel, USER_ROLES } from "../types"

export class Users {
    constructor(
        private id: string,
        private nickname: string,
        private email: string,
        private password: string,
        private role: USER_ROLES,
        private createdAt: string,
    ) { }

    public getId(): string {
        return this.id
    }

    public getNickname(): string {
        return this.nickname
    }

    public getEmail(): string {
        return this.email
    }

    public getPassword(): string {
        return this.password
    }

    public getRole(): USER_ROLES {
        return this.role
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setId(value: string): void {
        this.id = value
    }

    public setNickname(value: string): void {
        this.nickname = value
    }

    public setEmail(value: string): void {
        this.email = value
    }

    public setPassword(value: string): void {
        this.password = value
    }

    public setRole(value: USER_ROLES): void {
        this.role = value
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public toUserModel(): UserModel {
        return {
            id: this.id,
            nickname: this.nickname,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt
        }
    }
}