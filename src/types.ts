export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLES,
    created_at: string
}

export interface UserModel {
    id: string,
    nickname: string,
    email: string,
    role: USER_ROLES,
    createdAt: string
}

export interface ProductDB {
    id: string,
    creator_id: string,
    name: string,
    price: number,
    description: string,
    image_url: string
}

export interface ProductModel {
    id: string,
    name: string,
    price: number,
    description: string,
    image_url: string,
    creator: {
        id: string,
        name: string
    }
}

export interface LikesDB {
    user_id: string,
    product_id: string,
    like: number
}

export enum PRODUCT_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
}

export interface PurchaseDB {
    id: string,
    buyer: string,
    total_price: number,
    created_at: string
}

export interface PurchaseModel {
    id: string,
    buyer: string,
    products: {
        id: string,
        quantity: number
    }
}

export interface PurchaseProductsDB {
    purchase_id: string,
    product_id: string,
    quantity: number
}

export interface PurchaseProductsModel {
    purchase_id: string,
    buyer_id: string,
    buyer_name: string,
    buyer_email: string,
    total_price: number,
    created_at: string,
    products: {
        id: string,
        name: string,
        price: number,
        description: string,
        imageUrl: string,
        quantity: number
    }
}

// export interface ProductDBWithCreatorName {
//     id: string,
//     creator_id: string,
//     name: string,
//     price: string,
//     description: string,
//     image_url: string,
//     creator_name: string
// }