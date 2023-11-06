import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { PurchaseBusiness } from "../../../src/business/PurchaseBusiness"
import { PurchasesProductsDatabaseMock } from "../../mocks/PurchaseProductsMock"
import { PurchasesDatabaseMock } from "../../mocks/PurchaseDatabaseMock"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { DeletePurchaseSchema } from "../../../src/dtos/purchasesDtos/deletePurchase.dto"
import { ForbiddenError } from "../../../src/errors/ForbiddenError"


describe("Testando deletePurchase", () => {
    const purchaseBusiness = new PurchaseBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new PurchasesDatabaseMock(),
        new PurchasesProductsDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve deletar uma compra", async () => {
        const input = DeletePurchaseSchema.parse({
            token: "token-mock-astrodev",
            purchase_id: "id-mock-purchase1"
        })

        const output = await purchaseBusiness.deletePurchase(input)

        expect(output).toBe(undefined)
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(1)
        try {
            const input = DeletePurchaseSchema.parse({
                token: "token-mock-astrode",
                purchase_id: "id-mock-purchase1"
            })
    
            await purchaseBusiness.deletePurchase(input)
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                expect(error.statusCode).toBe(401)
            }
        }
    })

    test("deve disparar um erro se a compra não existir", async () => {
        expect.assertions(1)
        try {
            const input = DeletePurchaseSchema.parse({
                token: "token-mock-astrodev",
                purchase_id: "id-mock-purchase10"
            })
    
            await purchaseBusiness.deletePurchase(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("deve disparar um erro se aquele não for o dona da compra", async () => {
        expect.assertions(2)
        try {
            const input = DeletePurchaseSchema.parse({
                token: "token-mock-astrodev",
                purchase_id: "id-mock-purchase2"
            })
      
            await purchaseBusiness.deletePurchase(input)
        } catch (error) {
            if(error instanceof ForbiddenError) {
                expect(error.statusCode).toBe(403),
                expect(error.message).toBe("Somente o dono da compra pode exclui-la")
            }
        }
      })
})