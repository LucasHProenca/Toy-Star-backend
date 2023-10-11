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

// export interface ProductDBWithCreatorName {
//     id: string,
//     creator_id: string,
//     name: string,
//     price: string,
//     description: string,
//     image_url: string,
//     creator_name: string
// }