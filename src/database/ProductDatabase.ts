import { LikesDB, ProductDB, PRODUCT_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class ProductDatabase extends BaseDatabase {
    public static TABLE_PRODUCTS = "products"
    public static TABLE_LIKES_DISLIKES = "likes_dislikesProducts"

    public async findProducts(q?: string): Promise<ProductDB[]> {
        let result: ProductDB[] = []

        if (q) {
            result = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).where("name", "LIKE", `%${q}%`)
        } else {
            result = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
        }
        return result
    }

    public async getFavorites(input: any) {
        return await BaseDatabase.connection(ProductDatabase.TABLE_LIKES_DISLIKES).where({ user_id: input.user_id, product_id: input.product_id })
    }

    public async findProduct(id: string): Promise<ProductDB | undefined> {
        const [productDBExists]: ProductDB[] = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).where({ id })
        return productDBExists
    }

    public async insertProduct(productDB: ProductDB): Promise<void> {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).insert(productDB)
    }

    public async updateProduct(productDB: ProductDB): Promise<void> {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).update(productDB).where({ id: productDB.id })
    }

    public async deleteProduct(id: string): Promise<void> {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).del().where({ id })
    }

    public findLike = async (
        likeDislikeDB: LikesDB
    ): Promise<PRODUCT_LIKE | undefined> => {

        const [result]: Array<LikesDB | undefined> = await BaseDatabase
            .connection(ProductDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikeDB.user_id,
                product_id: likeDislikeDB.product_id
            })

        if (result === undefined) {
            return undefined

        } else if (result.like === 1) {
            return PRODUCT_LIKE.ALREADY_LIKED
        }
    }

    public removeLike = async (likeDB: LikesDB): Promise<void> => {
        await BaseDatabase.connection(ProductDatabase.TABLE_LIKES_DISLIKES).del()
            .where({ user_id: likeDB.user_id, product_id: likeDB.product_id })
    }

    public insertLike = async (likeDb: LikesDB): Promise<void> => {
        await BaseDatabase.connection(ProductDatabase.TABLE_LIKES_DISLIKES).insert(likeDb)
    }
}