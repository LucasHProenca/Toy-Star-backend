import { PurchasesDatabase } from "../database/PurchasesDatabase";
import { UserDatabase } from "../database/UsersDatabase";
import { ProductDatabase } from "../database/ProductDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CreatePurchaseInputDTO, CreatePurchaseOutputDTO } from "../dtos/purchasesDtos/createPurchase.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { NotFoundError } from "../errors/NotFoundError";

export class PurchaseBusiness {
    constructor(
        private productDatabase: ProductDatabase,
        private userDatabase: UserDatabase,
        private purchaseDatabase: PurchasesDatabase,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ){}

    public createPurchase = async(input: CreatePurchaseInputDTO): Promise<CreatePurchaseOutputDTO> => {
        const {products, token} = input
        // const {id, quantity} = products

        const payload = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const idPurchase = this.idGenerator.generate()

        const purchase = await this.purchaseDatabase.findPurchase(idPurchase)
        const user = await this.userDatabase.findUserById(payload.id)

        if(!purchase) {
            throw new NotFoundError("Purchase não existe")
        }

        if(!user) {
            throw new NotFoundError("Usuario não cadastrado")
        }

        const resultProducts = []
        let totalPrice = 0
        // for(let prod of products) {
        //     const product = await this.productDatabase.findProduct({id:prod.id})
        // }

        const output: CreatePurchaseOutputDTO = undefined

        return output
    }
}