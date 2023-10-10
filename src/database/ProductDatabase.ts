import { ProductDB} from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class ProductDatabase extends BaseDatabase {
    public static TABLE_PRODUCTS = "products"
    public static TABLE_LIKES_DISLIKES = "likes_dislikesProducts"

    public async findProducts(q?: string): Promise<ProductDB[]> {
        let result: ProductDB[] = []

        if(q) {
            result = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).where("name", "LIKE", `%${q}%`)
        } else {
            result = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
        }
        return result
    }

    public async getLikes(input: any) {
        return await BaseDatabase.connection(ProductDatabase.TABLE_LIKES_DISLIKES).where({user_id: input.user_id, product_id: input.product_id})
    }

    public async findProduct(id: string): Promise<ProductDB | undefined> {
        const [productDBExists]: ProductDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).where({id})
        return productDBExists
    }

    public async insertProduct(productDB: ProductDB): Promise<void> {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).insert(productDB)
    }

    public async updateProduct(productDB: ProductDB): Promise<void> {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).update(productDB).where({id: productDB.id})
    }

    public async deleteProduct(id: string): Promise<void> {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).del().where({id})
    }

    // public async findProductWithCreatorName(id: string): Promise<ProductDBWithCreatorName | undefined> {
    //     const [result] = await BaseDatabase
    //     .connection(ProductDatabase.TABLE_PRODUCTS)
    //     .select(
    //         `${ProductDatabase.TABLE_PRODUCTS}.id`,
    //         `${ProductDatabase.TABLE_PRODUCTS}.name`,
    //         `${ProductDatabase.TABLE_PRODUCTS}.price`,
    //         `${ProductDatabase.TABLE_PRODUCTS}.description`,
    //         `${ProductDatabase.TABLE_PRODUCTS}.image_url`
    //     )
    //     .join(
    //         `${UserDatabase.TABLE_USERS}`,
    //         `${ProductDatabase.T}`
    //     )
    // }
}