import { IdGenerator } from "../services/IdGenerator"
import { TokenManager, USER_ROLES } from "../services/TokenManager"
import { ProductDatabase } from "../database/ProductDatabase"
import { UserDatabase } from "../database/UsersDatabase"
import { GetProductInputDTO, GetProductOutputDTO } from "../dtos/productsDtos/getProduct.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { ProductDB, ProductModel } from "../types"
import { Products } from "../models/Products"
import { CreateProductInputDTO, CreateProductOutputDTO } from "../dtos/productsDtos/createProduct.dto"
import { EditProductInputDTO } from "../dtos/productsDtos/editProduct.dto"
import { EditUserOutputDTO } from "../dtos/userDtos/editUser.dto"
import { NotFoundError } from "../errors/NotFoundError"
import { ForbiddenError } from "../errors/ForbiddenError"
import { DeleteProductInputDTO } from "../dtos/productsDtos/deleteProduct.dto"
import { DeleteUserOutputDTO } from "../dtos/userDtos/deleteUser.dto"

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
            const userIdExists = await this.userDatabase.findUserById(productDB.creator_id)

            if(!userIdExists) {
                throw new BadRequestError("Produto com criador não identificado")
            }

            const product = new Products(
                productDB.id,
                productDB.name,
                productDB.price,
                productDB.description,
                productDB.image_url,
                productDB.creator_id,
                userIdExists.nickname
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
            throw new ForbiddenError("Somente quem criou o post pode editá-lo")
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
}