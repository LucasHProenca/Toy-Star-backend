import { UserBusiness } from "../../../src/business/UserBusiness"
import { UserSignupSchema } from "../../../src/dtos/userDtos/userSignup.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar token ao cadastrar", async () => {
    const input = UserSignupSchema.parse({
      nickname: "Ciclana",
      email: "ciclana@email.com",
      password: "Ciclana08*"
    })

    const output = await userBusiness.userSignUp(input)

    expect(output).toEqual({
      token: "token-mock"
    })
  })

  test("deve disparar um erro se o email já existir", async () => {
    expect.assertions(2)
    try {
      const input = UserSignupSchema.parse({
        nickname: "ciclano",
        email: "fulano@email.com",
        password: "Fulano123*"
      })

      const output = await userBusiness.userSignUp(input)
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'email' já cadastrado"),
          expect(error.statusCode).toBe(400)
      }
    }
  })

  test("deve disparar um erro se o nickname já existir", async () => {
    expect.assertions(2)
    try {
      const input = UserSignupSchema.parse({
        nickname: "Fulano",
        email: "ciclano@email.com",
        password: "Ciclano123*"
      })

      const output = await userBusiness.userSignUp(input)
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'nickname' já cadastrado"),
          expect(error.statusCode).toBe(400)
      }
    }
  })
})