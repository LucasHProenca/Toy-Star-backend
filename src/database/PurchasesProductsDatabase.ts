import { PurchaseProductsDB, PurchaseProductsModel } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { ProductDatabase } from "./ProductDatabase";
import { PurchasesDatabase } from "./PurchasesDatabase";
import { UserDatabase } from "./UsersDatabase";


export class PurchasesProductsDatabase extends BaseDatabase {
    public static TABLE_PURCHASES_PRODUCTS = "purchases_products"
    public static TABLE_PURCHASES = "purchases"

    public async findPurchasesProducts(purchase_id: string): Promise<PurchaseProductsDB[]> {
        let result: PurchaseProductsDB[]

        [result] = await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS).where({ purchase_id })

        return result
    }

    public async findPurchasesById(purchase_id: string): Promise<PurchaseProductsModel | undefined> {
        const [result] = await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES)
            .select(
                `${PurchasesDatabase.TABLE_PURCHASES}.id as purchaseId`,
                `${PurchasesDatabase.TABLE_PURCHASES}.buyer as buyerId`,
                `${UserDatabase.TABLE_USERS}.nickname as buyerName`,
                `${UserDatabase.TABLE_USERS}.email as buyerEmail`,
                `${PurchasesDatabase.TABLE_PURCHASES}.total_price as totalPrice`,
                `${PurchasesDatabase.TABLE_PURCHASES}.created_at as createdAt`,
            )
            .innerJoin(
                `${UserDatabase.TABLE_USERS}`,
                `${PurchasesDatabase.TABLE_PURCHASES}.buyer`,
                "=",
                `${UserDatabase.TABLE_USERS}.id`
            )
            .where({[`${PurchasesDatabase.TABLE_PURCHASES}.id`]: purchase_id})

            const products = await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS)
            .select(
                `${ProductDatabase.TABLE_PRODUCTS}.id as id`,
                `${ProductDatabase.TABLE_PRODUCTS}.name as name`,
                `${ProductDatabase.TABLE_PRODUCTS}.price as price`,
                `${ProductDatabase.TABLE_PRODUCTS}.description as description`,
                `${ProductDatabase.TABLE_PRODUCTS}.image_url as imageUrl`,
                `${PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS}.quantity as quantity`
            )
            .innerJoin(
                `${ProductDatabase.TABLE_PRODUCTS}`,
                `${PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS}.product_id`,
                "=",
                `${ProductDatabase.TABLE_PRODUCTS}.id`
            )
            .where({[`${PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS}.purchase_id`]: purchase_id})

            const resultadinho = {...result, products}

            return resultadinho as PurchaseProductsModel | undefined
    }

    public async findPurchaseProducts(purchase_id: string): Promise<PurchaseProductsDB | undefined> {
        const [purchaseProductsDBExists]: PurchaseProductsDB[] = await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS).where({ purchase_id })
        return purchaseProductsDBExists
    }

    public async insertPurchaseProducts(purchaseProductDB: PurchaseProductsDB): Promise<void> {
        await BaseDatabase.connection(PurchasesProductsDatabase.TABLE_PURCHASES_PRODUCTS).insert(purchaseProductDB)
    }
}