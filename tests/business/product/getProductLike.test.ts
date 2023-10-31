import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductBusiness } from "../../../src/business/ProductBusiness"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { GetProductLikeSchema } from "../../../src/dtos/productsDtos/getFavoriteProduct.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"

describe("Testando getProductLike", () => {
    const productBusiness = new ProductBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve retornar se o usuario já deu like no produto", async () => {
        const input = GetProductLikeSchema.parse({
            token: "token-mock-astrodev",
            product_id: "id-mock-product2"
        })

        const output = await productBusiness.getFavoriteProduct(input)

        expect(output).toEqual([{
            user_id: "id-mock-astrodev",
            product_id: "id-mock-product2",
            like: 1
        }])
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = GetProductLikeSchema.parse({
                token: "token-mock-fulan",
                product_id: "id-mock-product2"
            })

            await productBusiness.getFavoriteProduct(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                    expect(error.message).toBe("Token inválido")
            }
        }
    })

    test("deve disparar um erro se o produto não existir", async () => {
        expect.assertions(2)
        try {
            const input = GetProductLikeSchema.parse({
                token: "token-mock-fulano",
                product_id: "id-mock-product5"
            })

            await productBusiness.getFavoriteProduct(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("'product' não encontrado")
            }
        }
    })
})