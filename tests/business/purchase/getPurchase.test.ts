import { BadRequestError } from "../../../src/errors/BadRequestError"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"
import { ProductDatabaseMock } from "../../mocks/ProductDatabaseMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { PurchaseBusiness } from "../../../src/business/PurchaseBusiness"
import { PurchasesProductsDatabaseMock } from "../../mocks/PurchaseProductsMock"
import { PurchasesDatabaseMock } from "../../mocks/PurchaseDatabaseMock"
import { GetPurchaseSchema } from "../../../src/dtos/purchasesDtos/getPurchase.dto"


describe("Testando getPurchases", () => {
    const purchaseBusiness = new PurchaseBusiness(
        new ProductDatabaseMock(),
        new UserDatabaseMock(),
        new PurchasesDatabaseMock(),
        new PurchasesProductsDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    )

    test("deve retornar uma compra pelo id", async () => {
        const input = GetPurchaseSchema.parse({
            token: "token-mock-astrodev",
            purchase_id: "id-mock-purchase1"
        })

        const output = await purchaseBusiness.getPurchase(input)

        expect(output).toStrictEqual({
            purchase_id: "id-mock-purchase1",
            buyer_id: "id-mock-astrodev",
            buyer_name: "Astrodev",
            buyer_email: "astrodev@email.com",
            total_price: 100,
            created_at: expect.any(String),
            products: {
                id: "id-mock-product1",
                name: "produto1",
                price: 100,
                description: "esse é o primeiro produto",
                imageUrl: "a imagem do primeiro produto",
                quantity: 1
            }
        })
    })

    test("deve disparar um erro se o token não for válido", async () => {
        expect.assertions(2)
        try {
            const input = GetPurchaseSchema.parse({
                token: "token-mock-fulan",
                purchase_id: "id-mock-purchase1"
            })

            await purchaseBusiness.getPurchase(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                    expect(error.message).toBe("Token inválido")
            }
        }
    })

    test("deve disparar um erro se a compra não existir", async () => {
        expect.assertions(2)
        try {
            const input = GetPurchaseSchema.parse({
                token: "token-mock-fulano",
                purchase_id: "id-mock-purchase5"
            })

            await purchaseBusiness.getPurchase(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400),
                    expect(error.message).toBe("Informações invalidas")
            }
        }
    })
})