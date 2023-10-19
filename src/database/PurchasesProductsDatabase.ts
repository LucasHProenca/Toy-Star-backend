import { PurchaseProductsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";


export class PurchasesProductsDatabase extends BaseDatabase {
    public static TABLE_PURCHASES_PRODUCTS = "purchases_products"
    
    public async findPurchasesProducts(purchase_id: string): Promise<PurchaseProductsDB[]> {
        let result: PurchaseProductsDB[] = []

        result = await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS).where({purchase_id})

        return result
    }

    public async findPurchaseProducts(purchase_id:string): Promise<PurchaseProductsDB | undefined> {
        const [purchaseProductsDBExists]: PurchaseProductsDB[] = await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS).where({purchase_id})
        return purchaseProductsDBExists
    }

    public async insertPurchaseProducts(purchaseProductDB: PurchaseProductsDB): Promise<void> {
        await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS).insert(purchaseProductDB)
    }
}