import { PurchaseDB } from "../../src/types";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const purchasesMock: PurchaseDB[] = [{
    id: "id-mock-purchase1",
    buyer: "id-mock-astrodev",
    total_price: 100,
    created_at: new Date().toISOString()
},
{
    id: "id-mock-purchase2",
    buyer: "id-mock-fulano",
    total_price: 200,
    created_at: new Date().toISOString()
}
]

export class PurchasesDatabaseMock extends BaseDatabase {
    public static TABLE_PURCHASES = "purchases"
    public static TABLE_LIKES_DISLIKES_PRODUCTS = "likes_dislikesProducts"

    public async findPurchases(id: string): Promise<PurchaseDB[]> {
        return purchasesMock.filter(purchase => purchase.id === id)
    }

    public async findPurchase(id: string): Promise<PurchaseDB | undefined> {
        return purchasesMock.filter(purchase => purchase.id === id)[0]
    }

    public async insertPurchase(purchaseDB: PurchaseDB): Promise<void> {
    }

    public async deletePurchase(id: string): Promise<void> {
    }
}