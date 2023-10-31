import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductBusiness } from "../../../src/business/ProductBusiness"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { GetProductSchema } from "../../../src/dtos/productsDtos/getProduct.dto"

describe("Testando getProducts", () => {
  const productBusiness = new ProductBusiness(
    new ProductDatabaseMock(),
    new UserDatabaseMock(),
    new TokenManagerMock(),
    new IdGeneratorMock()
  )

  test("deve retornar lista de todos os produtos", async () => {
    const input = GetProductSchema.parse({
      token: "token-mock-astrodev"
    })

    const output = await productBusiness.getProducts(input)

    expect(output).toHaveLength(3)
  })

  test("deve disparar um erro se o token não for válido", async () => {
    expect.assertions(2)
    try {
      const input = GetProductSchema.parse({
        token: "token-mock-fulan",
      })

      await productBusiness.getProducts(input)
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.statusCode).toBe(400),
          expect(error.message).toBe("Token inválido")
      }
    }
  })
})