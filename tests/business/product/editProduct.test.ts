import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductBusiness } from "../../../src/business/ProductBusiness"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { EditProductSchema } from "../../../src/dtos/productsDtos/editProduct.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"

describe("Testando editProducts", () => {
    const productBusiness = new ProductBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve editar um produto", async () => {
        const input = EditProductSchema.parse({
            token: "token-mock-fulano",
            id: "id-mock-product2",
            name: "produto3",
        })

        const output = await productBusiness.editProduct(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = EditProductSchema.parse({
                token: "token-mock-fulan",
                id: "id-mock-product2",
                name: "produto3",
                price: 500,
                description: "terceiro produto",
                imageUrl: "imagem do terceiro produto"
            })

            await productBusiness.editProduct(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                    expect(error.message).toBe("Token inválido")
            }
        }
    })

    test("deve disparar um erro se o id do produto não existir", async () => {
        expect.assertions(2)
        try {
            const input = EditProductSchema.parse({
                token: "token-mock-fulano",
                id: "id-mock-product5",
                name: "produto3"
            })
      
            await productBusiness.editProduct(input)
        } catch (error) {
            if(error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                expect(error.message).toBe("'Produto' não encontrado")
            }
        }
      })

      test("deve disparar um erro se o usuário não for o dono do produto", async () => {
        expect.assertions(2)
        try {
            const input = EditProductSchema.parse({
                token: "token-mock-astrodev",
                id: "id-mock-product2",
                name: "produto3"
            })
      
            await productBusiness.editProduct(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403),
                expect(error.message).toBe("Somente quem criou o produto pode editá-lo")
            }
        }
      })
})