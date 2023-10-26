import { LikesDB, ProductDB, PRODUCT_LIKE } from "../../src/types";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const productsMock: ProductDB[] = [
    {
        id: "id-mock-product1'",
        creator_id: "id-mock-astrodev",
        name: "produto1",
        price: 100,
        description: "esse é o primeiro produto",
        image_url: "a imagem do primeiro produto"
    },
    {
        id: "id-mock-product2",
        creator_id: "id-mock-fulano",
        name: "produto2",
        price: 200,
        description: "esse é o segundo produto",
        image_url: "a imagem do segundo produto"
    },
    {
        id: "id-mock-product3'",
        creator_id: "id-mock-astrodev",
        name: "produto3",
        price: 100,
        description: "esse é o terceiro produto",
        image_url: "a imagem do terceiro produto"
    },
]

const likeDB: LikesDB[] = [
    {
        user_id: "id-mock-fulano",
        product_id: "id-mock-product1",
        like: 0
    },
    {
        user_id: "id-mock-astrodev",
        product_id: "id-mock-product2",
        like: 1
    }
]

export class ProductDatabaseMock extends BaseDatabase {
    public static TABLE_PRODUCTS = "products"
    public static TABLE_LIKES_DISLIKES = "likes_dislikesProducts"

    public async findProducts(q?: string): Promise<ProductDB[]> {
        if (q) {
            return productsMock.filter(product =>
                product.name.toLocaleLowerCase()
                    .includes(q.toLocaleLowerCase()))
        } else {
            return productsMock
        }
    }

    public async getFavorites(input: any) {
        return likeDB.filter((product) => product.product_id === input.product_id && product.user_id === input.user_id)
    }

    public async findProduct(id: string): Promise<ProductDB | undefined> {
        return productsMock.filter(post => post.id === id)[0]
    }

    public async insertProduct(productDB: ProductDB): Promise<void> {

    }

    public async updateProduct(productDB: ProductDB): Promise<void> {
    }

    public async deleteProduct(id: string): Promise<void> {
    }

    public findLike = async (
        likeDislikeDB: LikesDB
    ): Promise<PRODUCT_LIKE | undefined> => {

        const [result]: Array<LikesDB | undefined> = likeDB.filter((product => product.product_id === likeDislikeDB.product_id
            && product.user_id === likeDislikeDB.user_id))

        if (result === undefined) {
            return undefined

        } else if (result.like === 1) {
            return PRODUCT_LIKE.ALREADY_LIKED
        }
    }

    public removeLike = async (likeDB: LikesDB): Promise<void> => {
    }

    public insertLike = async (likeDb: LikesDB): Promise<void> => {
    }
}