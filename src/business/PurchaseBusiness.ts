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
import { PurchaseProductsModel } from "../types";

export class PurchaseBusiness {
    constructor(
        private productDatabase: ProductDatabase,
        private userDatabase: UserDatabase,
        private purchaseDatabase: PurchasesDatabase,
        private purchaseProductsDatabase: PurchasesProductsDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) { }

    public getPurchase = async (input: GetPurchaseInputDTO): Promise<GetPurchaseOutputDTO> => {
        const {purchase_id, token} = input
        const payload = this.tokenManager.getPayload(token)
        if (!payload) {
            throw new UnauthorizedError()
        }

        const purchasesModel: PurchaseProductsModel[] = []
        const purchasesDB = await this.purchaseProductsDatabase.findPurchasesProducts(purchase_id)
        console.log(purchasesDB)

        for (let purchaseDB of purchasesDB) {
            const userIdExists = await this.userDatabase.findUserById(payload.id)
            const productIdExists = await this.productDatabase.findProduct(purchaseDB.product_id)

            if(!userIdExists) {
                throw new BadRequestError("Compra com usuário não identificado")
            }

            if(!productIdExists) {
                throw new BadRequestError("Produto não existe")
            }

            const purchaseIdExists = await this.purchaseDatabase.findPurchase(purchaseDB.purchase_id)

            if(!purchaseIdExists) {
                throw new BadRequestError("Compra não existe")
            }

            const purchase = new PurchasesProducts(
                purchase_id,
                userIdExists.id,
                userIdExists.nickname,
                userIdExists.email,
                purchaseIdExists.total_price,
                purchaseIdExists.created_at,
                productIdExists.id,
                productIdExists.name,
                productIdExists.price,
                productIdExists.description,
                productIdExists.image_url,
                purchaseDB.quantity
            )

            purchasesModel.push(purchase.toPurchaseProductsModel())
        }
        // console.log(purchasesModel)
        const output: GetPurchaseOutputDTO = purchasesModel
        // console.log(output)
        return output
    }

    public createPurchase = async (input: CreatePurchaseInputDTO): Promise<CreatePurchaseOutputDTO> => {
        const { products, token } = input

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        // if(id) {
        //     throw new NotFoundError("Purchase id já cadastrada")
        // }

        // const purchase = await this.purchaseDatabase.findPurchase(id)
        const user = await this.userDatabase.findUserById(payload.id)

        // if(purchase) {
        //     throw new BadRequestError("Purchase já existe")
        // }

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
}