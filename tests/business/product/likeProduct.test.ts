import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductBusiness } from "../../../src/business/ProductBusiness"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { PutLikeProductSchema } from "../../../src/dtos/productsDtos/putLikeProduct.dto"

describe("Testando likeProduct", () => {
    const productBusiness = new ProductBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve dar like em um produto", async () => {
        const input = PutLikeProductSchema.parse({
            token: "token-mock-astrodev",
            product_id: "id-mock-product2",
            like: true
        })

        const output = await productBusiness.likeProduct(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = PutLikeProductSchema.parse({
                token: "token-mock-fulan",
                product_id: "id-mock-product1",
                like: true
            })

            await productBusiness.likeProduct(input)
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
            const input = PutLikeProductSchema.parse({
                token: "token-mock-fulano",
                product_id: "id-mock-product5",
                like: true
            })

            await productBusiness.likeProduct(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404),
                    expect(error.message).toBe("Produto não encontrado")
            }
        }
    })
    test("deve inserir like num produto que já tinha like", async () => {
        const input = PutLikeProductSchema.parse({
            product_id: "id-mock-product2",
            token: "token-mock-astrodev",
            like: true
        })

        const output = await productBusiness.likeProduct(input)

        expect(output).toBe(undefined)
    })
})