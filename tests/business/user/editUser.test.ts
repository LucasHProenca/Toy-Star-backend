import { UserBusiness } from "../../../src/business/UserBusiness"
import { EditUserSchema } from "../../../src/dtos/userDtos/editUser.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando editUser", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve editar o usuário", async () => {
        const input = EditUserSchema.parse({
            token: "token-mock-astrodev",
            id: "id-mock-astrodev",
            nickname: "devastro"
        })

        const output = await userBusiness.editUser(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = EditUserSchema.parse({
                id: "id-mock-fulano",
                token: "token-mock-fulan",
                nickname: "fulaninho"
            })

            await userBusiness.editUser(input)
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
            const input = EditUserSchema.parse({
                id: "id-mock-fulan",
                token: "token-mock-fulano",
                nickname: "fulaninho"
            })

            await userBusiness.editUser(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                    expect(error.message).toBe("'user' não encontrado")
            }
        }
    })

    test("deve disparar um erro se o usuário não for o dono da conta", async () => {
        expect.assertions(2)
        try {
            const input = EditUserSchema.parse({
                id: "id-mock-fulano",
                token: "token-mock-astrodev",
                nickname: "fulaninho"
            })

            await userBusiness.editUser(input)
        } catch (error) {
            if (error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403),
                    expect(error.message).toBe("Somente o dono da conta pode edita-la")
            }
        }
    })

    test("deve disparar um erro se o apelido já estiver cadastrado", async () => {
        expect.assertions(1)
        try {
            const input = EditUserSchema.parse({
                id: "id-mock-fulano",
                token: "token-mock-fulano",
                nickname: "Fulano"
            })

            await userBusiness.editUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar um erro se o email já estiver cadastrado", async () => {
        expect.assertions(1)
        try {
            const input = EditUserSchema.parse({
                id: "id-mock-fulano",
                token: "token-mock-fulano",
                email: "fulano@email.com"
            })

            await userBusiness.editUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
            }
        }
    })
})