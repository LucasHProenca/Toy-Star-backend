import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductBusiness } from "../../../src/business/ProductBusiness"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { DeleteProductSchema } from "../../../src/dtos/productsDtos/deleteProduct.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"

describe("Testando deleteProducts", () => {
    const productBusiness = new ProductBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    // test("deve deletar um produto", async () => {
    //     const input = DeleteProductSchema.parse({
    //         token: "token-mock-fulano",
    //         id: "id-mock-product2"
    //     })

    //     const output = await productBusiness.deleteProducts(input)

    //     expect(output).toBe(undefined)
    // })

    // test("deve disparar um erro se o token não for válido", async () => {
    //     expect.assertions(2)
    //     try {
    //         const input = DeleteProductSchema.parse({
    //             token: "token-mock-fulan",
    //             id: "id-mock-product1"
    //         })

    //         await productBusiness.deleteProducts(input)
    //     } catch (error) {
    //         if (error instanceof BadRequestError) {
    //             expect(error.statusCode).toBe(400),
    //                 expect(error.message).toBe("Token inválido")
    //         }
    //     }
    // })

    // test("deve disparar um erro se o id do produto não existir", async () => {
    //     expect.assertions(2)
    //     try {
    //         const input = DeleteProductSchema.parse({
    //             token: "token-mock-fulano",
    //             id: "id-mock-product5",
    //         })
      
    //         await productBusiness.deleteProducts(input)
    //     } catch (error) {
    //         if(error instanceof NotFoundError) {
    //             expect(error.statusCode).toBe(404),
    //             expect(error.message).toBe("'Id' do produto não encontrado")
    //         }
    //     }
    //   })

      test("deve disparar um erro se o usuário tentar deletar um produto sem ser admin", async () => {
        expect.assertions(1)
        try {
            const input = DeleteProductSchema.parse({
                token:"token-mock-fulano",
                id:"id-mock-product1"
            })
            await productBusiness.deleteProducts(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403)
            }
        }
      })
})