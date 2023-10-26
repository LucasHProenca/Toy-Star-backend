import { IdGenerator } from "../services/IdGenerator"
import { TokenManager, USER_ROLES } from "../services/TokenManager"
import { ProductDatabase } from "../database/ProductDatabase"
import { UserDatabase } from "../database/UsersDatabase"
import { GetProductInputDTO, GetProductOutputDTO } from "../dtos/productsDtos/getProduct.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { LikesDB, ProductDB, ProductModel, PRODUCT_LIKE } from "../types"
import { Products } from "../models/Products"
import { CreateProductInputDTO, CreateProductOutputDTO } from "../dtos/productsDtos/createProduct.dto"
import { EditProductInputDTO } from "../dtos/productsDtos/editProduct.dto"
import { EditUserOutputDTO } from "../dtos/userDtos/editUser.dto"
import { NotFoundError } from "../errors/NotFoundError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { DeleteProductInputDTO } from "../dtos/productsDtos/deleteProduct.dto"
import { DeleteUserOutputDTO } from "../dtos/userDtos/deleteUser.dto"
import { GetProductLikeInputDTO} from "../dtos/productsDtos/getFavoriteProduct.dto"
import { PutLikeProductInputDTO, PutLikeProductOutputDTO } from "../dtos/productsDtos/putLikeProduct.dto"

export class ProductBusiness {
    constructor(
        private productDatabase: ProductDatabase,
        private userDatabase: UserDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ){}

    public getProducts = async (input: GetProductInputDTO): Promise<GetProductOutputDTO> => {
        const {q, token} = input

        const payload = this.tokenManager.getPayload(token)

        if(payload === null) {
            throw new BadRequestError("Token inválido")
        }

        const productsModel: ProductModel[] = []
        const productsDB = await this.productDatabase.findProducts(q)

        for(let productDB of productsDB) {
            // const userIdExists = await this.userDatabase.findUserById(productDB.creator_id)

            // if(!userIdExists) {
            //     throw new BadRequestError("Produto com criador não identificado")
            // }

            const product = new Products(
                productDB.id,
                productDB.name,
                productDB.price,
                productDB.description,
                productDB.image_url,
                productDB.creator_id,
                payload.name
            )

            productsModel.push(product.toProductModel())
        }

        const output: GetProductOutputDTO = productsModel

        return output
    }

    public createProduct = async (input: CreateProductInputDTO): Promise<CreateProductOutputDTO> => {
        const {token, name, price, description, imageUrl} = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new BadRequestError("Token inválido")
        }

        const id = this.idGenerator.generate()

        const product = new Products(
            id,
            name,
            price,
            description,
            imageUrl,
            payload.id,
            payload.name
        )

        await this.productDatabase.insertProduct(product.toProductDB())

        const output: CreateProductOutputDTO = undefined

        return output
    }

    public editProduct = async (input: EditProductInputDTO): Promise<EditUserOutputDTO> => {
        const {id, token, name, price, description, imageUrl} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new BadRequestError("Token inválido")
        }

        const productDB = await this.productDatabase.findProduct(id)

        if(!productDB) {
            throw new NotFoundError("'Produto' não encontrado")
        }

        if(payload.id !== productDB.creator_id) {
            throw new ForbiddenError("Somente quem criou o produto pode editá-lo")
        }

        const product = new Products(
            productDB.id, productDB.name, productDB.price, productDB.description, productDB.image_url, productDB.creator_id, payload.name
        )

        name && product.setName(name)
        price && product.setPrice(price)
        description && product.setDescription(description)
        imageUrl && product.setImageUrl(imageUrl)

        const productEdited: ProductDB = {
            id: product.getId(),
            creator_id: product.getCreatorId(),
            name: product.getName(),
            price: product.getPrice(),
            description: product.getDescription(),
            image_url: product.getImageUrl() 
        }

        await this.productDatabase.updateProduct(productEdited)

        const output: EditUserOutputDTO = undefined

        return output
    }

    public deleteProducts = async (input: DeleteProductInputDTO): Promise<DeleteUserOutputDTO> => {
        const {id, token} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new BadRequestError("Token inválido")
        }

        const productExists = await this.productDatabase.findProduct(id)

        if(!productExists) {
            throw new NotFoundError("'Id' do produto não encontrado")
        }

        if(payload.role !== USER_ROLES.ADMIN) {
            if(payload.id !== productExists.creator_id) {
                throw new ForbiddenError("Somente admins e quem criou o produto podem deleta-lo")
            }
        }

        await this.productDatabase.deleteProduct(id)

        const output: DeleteUserOutputDTO = undefined

        return output
    }

    public async getFavoriteProduct(input: GetProductLikeInputDTO): Promise<GetProductOutputDTO> {
        const {product_id, token} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new BadRequestError("Token inválido")
        }

        const user = await this.userDatabase.findUserById(payload.id)
        const product = await this.productDatabase.findProduct(product_id)

        if(!user) {
            throw new NotFoundError("'user' não encontrado")
        }

        if(!product) {
            throw new NotFoundError("'product' não encontrado")
        }

        const searchInDb = {
            user_id: user.id,
            product_id: product.id
        }

        const output: GetProductOutputDTO = await this.productDatabase.getFavorites(searchInDb)
        return output
    }

    public likeProduct = async (input: PutLikeProductInputDTO): Promise<PutLikeProductOutputDTO> => {
        const {product_id, token, like} = input

        const payload = this.tokenManager.getPayload(token)

        if(!payload) {
            throw new BadRequestError("Token inválido")
        }

        if (like !== undefined) {
            if (typeof like !== "boolean") {
                throw new BadRequestError("'like' deve ser do tipo boolean")
            }
        }

        const productIdExists = await this.productDatabase.findProduct(product_id)

        if(!productIdExists) {
            throw new NotFoundError("Produto não encontrado")
        }

        const likeSQlite = like? 1:0

        const likesDB: LikesDB = {
            user_id: payload.id,
            product_id: product_id,
            like: likeSQlite
        }

        const likeExists = await this.productDatabase.findLike(likesDB)

        if(likeExists === PRODUCT_LIKE.ALREADY_LIKED) {
            if(like) {
                await this.productDatabase.removeLike(likesDB)
            }
    }else {
        await this.productDatabase.insertLike(likesDB)
    }

    const output: PutLikeProductOutputDTO = undefined
    return output
}
}