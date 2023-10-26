import { UserBusiness } from "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/userDtos/userLogin.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123"
    })

    const output = await userBusiness.login(input)

    expect(output).toEqual({
      token: "token-mock-fulano"
    })
  })

  test("deve retornar um erro se o email não estiver cadastrado", async () => {
    expect.assertions(2)

    try {
      const input = LoginSchema.parse({
        email: "fulanoo@email.com",
        password: "fulano123"
      })

      const output = await userBusiness.login(input)

    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("'email' não encontrado"),
          expect(error.statusCode).toBe(404)
      }
    }

  })

  test("Deve retornar um erro se email e senha não fizerem login", async () => {
    expect.assertions(2)

    try {
      const input = LoginSchema.parse({
        email: "fulano@email.com",
        password: "fulano1234"
      })

      const output = await userBusiness.login(input)

    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'email' ou 'password' incorretos")
        expect(error.statusCode).toBe(400)
      }
    }

  })
})