import { UserBusiness } from "../../../src/business/UserBusiness"
import { DeleteUserSchema } from "../../../src/dtos/userDtos/deleteUser.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando deleteUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve deletar", async () => {
        const input = DeleteUserSchema.parse({
            token: "token-mock-astrodev",
            id: "id-mock-astrodev",
        })

        const output = await userBusiness.deleteUser(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = DeleteUserSchema.parse({
                id: "id-mock-fulano",
                token: "token-mock-fulan"
            })

            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                    expect(error.message).toBe("Token inválido")
            }
        }
    })

    test("deve disparar um erro se o id usuário não existir", async () => {
        expect.assertions(2)
        try {
            const input = DeleteUserSchema.parse({
                id: "id-mock-fulan",
                token: "token-mock-fulano",
            })

            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                    expect(error.message).toBe("'id' do usuário não existe")
            }
        }
    })

    test("deve disparar um erro se a conta não for do usuário nem ele um admin", async () => {
        expect.assertions(2)
        try {
            const input = DeleteUserSchema.parse({
                id: "id-mock-astrodev",
                token: "token-mock-fulano",
            })

            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403),
                    expect(error.message).toBe("Somente admins e o dono da conta podem deleta-la")
            }
        }
    })

})