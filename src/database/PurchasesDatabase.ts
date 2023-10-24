import { PurchaseDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PurchasesDatabase extends BaseDatabase {
    public static TABLE_PURCHASES = "purchases"
    public static TABLE_LIKES_DISLIKES_PRODUCTS = "likes_dislikesProducts"

    public async findPurchases(id:string):Promise<PurchaseDB[]> {
        let result: PurchaseDB[] = []

        result = await BaseDatabase.connection(PurchasesDatabase.TABLE_PURCHASES).where({id})

        return result
    }

    public async findPurchase(id:string): Promise<PurchaseDB | undefined> {
        const [purchaseDBExists]: PurchaseDB[] = await BaseDatabase.connection(PurchasesDatabase.TABLE_PURCHASES).where({id})
        return purchaseDBExists
    }

    public async insertPurchase(purchaseDB: PurchaseDB): Promise<void> {
        await BaseDatabase.connection(PurchasesDatabase.TABLE_PURCHASES).insert(purchaseDB)
    }

   public async deletePurchase(id: string): Promise<void> {
    await BaseDatabase.connection(PurchasesDatabase.TABLE_PURCHASES).del().where({id})
   }
}