import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { PurchaseBusiness } from "../../../src/business/PurchaseBusiness"
import { PurchasesProductsDatabaseMock } from "../../mocks/PurchaseProductsMock"
import { PurchasesDatabaseMock } from "../../mocks/PurchaseDatabaseMock"
import { CreatePurchaseSchema } from "../../../src/dtos/purchasesDtos/createPurchase.dto"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"


describe("Testando createPurchase", () => {
    const purchaseBusiness = new PurchaseBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new PurchasesDatabaseMock(),
        new PurchasesProductsDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve criar uma compra", async () => {
        const input = CreatePurchaseSchema.parse({
            token: "token-mock-astrodev",
            products: [
                {
                    id: "id-mock-product2",
                    quantity: 1
                }
            ]
        })

        const output = await purchaseBusiness.createPurchase(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = CreatePurchaseSchema.parse({
                token: "token-mock-astrode",
                products: [
                    {
                        id: "id-mock-product1",
                        quantity: 1
                    }
                ]
            })

            await purchaseBusiness.createPurchase(input)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
    })

    test("deve disparar um erro se o produto não existir", async () => {
        expect.assertions(1)
        try {
            const input = CreatePurchaseSchema.parse({
                token: "token-mock-astrodev",
                products: [
                    {
                        id: "id-mock-product7",
                        quantity: 1
                    }
                ]
            })

            await purchaseBusiness.createPurchase(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
            }
        }
    })
})