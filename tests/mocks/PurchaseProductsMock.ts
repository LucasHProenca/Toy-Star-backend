import { PurchaseProductsDB, PurchaseProductsModel } from "../../src/types";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const purchasesProductsMock: PurchaseProductsDB[] = [{
    purchase_id: "id-mock-purchase1",
    product_id: "id-mock-product1",
    quantity: 1
},
{
    purchase_id: "id-mock-purchase2",
    product_id: "id-mock-product2",
    quantity: 1
}
]

const purchasesProductsMockModel: PurchaseProductsModel[] = [
    {
        purchase_id: "id-mock-purchase1",
        buyer_id: "id-mock-astrodev",
        buyer_name: "Astrodev",
        buyer_email: "astrodev@email.com",
        total_price: 100,
        created_at: new Date().toISOString(),
        products: {
            id: "id-mock-product1",
            name: "produto1",
            price: 100,
            description: "esse é o primeiro produto",
            imageUrl: "a imagem do primeiro produto",
            quantity: 1
        }
    },
    {
        purchase_id: "id-mock-purchase2",
        buyer_id: "id-mock-fulano",
        buyer_name: "Fulano",
        buyer_email: "fulano@email.com",
        total_price: 200,
        created_at: new Date().toISOString(),
        products: {
            id: "id-mock-product2",
            name: "produto2",
            price: 200,
            description: "esse é o segundo produto",
            imageUrl: "a imagem do segundo produto",
            quantity: 1
        }
    }
]

export class PurchasesProductsDatabaseMock extends BaseDatabase {
    public static TABLE_PURCHASES_PRODUCTS = "purchases_products"
    public static TABLE_PURCHASES = "purchases"

    public async findPurchasesProducts(purchase_id: string): Promise<PurchaseProductsDB[]> {
        return purchasesProductsMock.filter(purchase => purchase.purchase_id === purchase_id)
    }

    public async findPurchasesById(purchase_id: string): Promise<PurchaseProductsModel | undefined> {
        return purchasesProductsMockModel.filter((purchase => purchase.purchase_id === purchase_id))[0] || undefined
    }

    public async findPurchaseProducts(purchase_id: string): Promise<PurchaseProductsDB | undefined> {
        return purchasesProductsMock.filter(purchase => purchase.purchase_id === purchase_id)[0]
    }

    public async insertPurchaseProducts(purchaseProductDB: PurchaseProductsDB): Promise<void> {
    }
}