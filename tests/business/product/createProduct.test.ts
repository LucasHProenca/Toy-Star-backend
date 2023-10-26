import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductBusiness } from "../../../src/business/ProductBusiness"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { CreateProductSchema } from "../../../src/dtos/productsDtos/createProduct.dto"

describe("Testando createProducts", () => {
    const productBusiness = new ProductBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve criar um novo produto", async () => {
        const input = CreateProductSchema.parse({
            token: "token-mock-astrodev",
            name: "produto3",
            price: 500,
            description: "terceiro produto",
            imageUrl: "imagem do terceiro produto"
        })

        const output = await productBusiness.createProduct(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = CreateProductSchema.parse({
                token: "token-mock-fulan",
                name: "produto3",
                price: 500,
                description: "terceiro produto",
                imageUrl: "imagem do terceiro produto"
            })

            await productBusiness.createProduct(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                    expect(error.message).toBe("Token inválido")
            }
        }
    })
})