import { BaseDatabase } from "../../src/database/BaseDatabase";
import { UserDB, USER_ROLES } from "../../src/types"

const usersMock: UserDB[] = [
    {
        id: "id-mock-fulano",
        nickname: "Fulano",
        email: "fulano@email.com",
        password: "hash-mock-fulano", // senha = "fulano123"
        created_at: new Date().toISOString(),
        role: USER_ROLES.NORMAL
    },
    {
        id: "id-mock-astrodev",
        nickname: "Astrodev",
        email: "astrodev@email.com",
        password: "hash-mock-astrodev", // senha = "astrodev99"
        created_at: new Date().toISOString(),
        role: USER_ROLES.ADMIN
    },
]

export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async signUp(
        userDB: UserDB
    ): Promise<void> {
    }

    public async findUserById(
        id: string
    ): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.id === id)[0]
    }

    public async findUserByEmail(
        email: string
    ): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.email === email)[0]
    }

    public async findUserByNickname(nickname: string): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.nickname === nickname)[0]
    }

    public async findUsers(
    ): Promise<UserDB[]> {
        return usersMock
    }

    public async updateUser(userDB: UserDB): Promise<void> {
    }

    public async deleteUser(id: string): Promise<void> {
    }
}