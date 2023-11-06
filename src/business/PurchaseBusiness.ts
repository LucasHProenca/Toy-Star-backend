import { PurchasesDatabase } from "../database/PurchasesDatabase";
import { UserDatabase } from "../database/UsersDatabase";
import { ProductDatabase } from "../database/ProductDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CreatePurchaseInputDTO, CreatePurchaseOutputDTO } from "../dtos/purchasesDtos/createPurchase.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";
import { Purchases } from "../models/Purchases";
import { PurchasesProducts } from "../models/PurchasesProducts";
import { PurchasesProductsDatabase } from "../database/PurchasesProductsDatabase";
import { BadRequestError } from "../errors/BadRequestError";
import { GetPurchaseInputDTO, GetPurchaseOutputDTO } from "../dtos/purchasesDtos/getPurchase.dto";
import { DeletePurchaseInputDTO, DeletePurchaseOutputDTO } from "../dtos/purchasesDtos/deletePurchase.dto";
import { DeleteProductOutputDTO } from "../dtos/productsDtos/deleteProduct.dto";
import { ForbiddenError } from "../errors/ForbiddenError";

export class PurchaseBusiness {
    constructor(
        private productDatabase: ProductDatabase,
        private userDatabase: UserDatabase,
        private purchaseDatabase: PurchasesDatabase,
        private purchaseProductsDatabase: PurchasesProductsDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) { }

    public getPurchase = async (input: GetPurchaseInputDTO): Promise<any> => {
        const { purchase_id, token } = input
        const payload = this.tokenManager.getPayload(token)
        if (payload === null) {
            throw new BadRequestError("Token inválido")
        }

        const purchasesDB = await this.purchaseProductsDatabase.findPurchasesById(purchase_id)

        if (!purchasesDB) {
            throw new BadRequestError("Informações invalidas")
        }

        return purchasesDB
    }

    public createPurchase = async (input: CreatePurchaseInputDTO): Promise<CreatePurchaseOutputDTO> => {
        const { products, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const user = await this.userDatabase.findUserById(payload.id)

        if (!user) {
            throw new NotFoundError("Usuario não cadastrado")
        }

        const resultProducts = []
        let totalPrice = 0
        for (let prod of products) {
            const product = await this.productDatabase.findProduct(prod.id)
            if (!product) {
                throw new NotFoundError(`${prod.id} não encontrado`)
            }
            resultProducts.push({ ...product, quantity: prod.quantity })
        }

        for (let product of resultProducts) {
            totalPrice += product.price * product.quantity
        }

        const newPurchase = new Purchases(
            id,
            payload.id,
            totalPrice,
            new Date().toISOString()
        )

        await this.purchaseDatabase.insertPurchase(newPurchase.toPurchaseDB())

        for (let prd of products) {
            const product = await this.productDatabase.findProduct(prd.id)
            if (!product) {
                throw new NotFoundError(`${prd.id} não encontrado`)
            }
            const newPurchaseProducts = new PurchasesProducts(
                id,
                user.id,
                user.nickname,
                user.email,
                totalPrice,
                new Date().toISOString(),
                product.id,
                product.name,
                product.price,
                product.description,
                product.image_url,
                prd.quantity
            )

            await this.purchaseProductsDatabase.insertPurchaseProducts(newPurchaseProducts.toPurchaseProductsDB())
        }

        const output: CreatePurchaseOutputDTO = undefined

        return output
    }

    public deletePurchase = async (input: DeletePurchaseInputDTO): Promise<DeleteProductOutputDTO> => {
        const {purchase_id, token} = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const purchaseIdExists = await this.purchaseDatabase.findPurchase(purchase_id)

        if(!purchaseIdExists) {
            throw new NotFoundError("Essa compra não existe")
        }

        if(payload.id !== purchaseIdExists.buyer) {
            throw new ForbiddenError("Somente o dono da compra pode exclui-la")
        }

        await this.purchaseDatabase.deletePurchase(purchase_id)

        const output: DeletePurchaseOutputDTO = undefined

        return output
    }
}