import express from "express"
import { PurchaseBusiness } from "../business/PurchaseBusiness"
import { PurchasesController } from "../controller/PurchasesController"
import { ProductDatabase } from "../database/ProductDatabase"
import { PurchasesDatabase } from "../database/PurchasesDatabase"
import { PurchasesProductsDatabase } from "../database/PurchasesProductsDatabase"
import { UserDatabase } from "../database/UsersDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"


export const purchaseRouter = express.Router()

const purchaseController = new PurchasesController(
    new PurchaseBusiness(
        new ProductDatabase(),
        new UserDatabase(),
        new PurchasesDatabase(),
        new PurchasesProductsDatabase(),
        new TokenManager(),
        new IdGenerator()
    )
)

purchaseRouter.post("/", purchaseController.createPurchase)
purchaseRouter.get("/:id", purchaseController.getPurchases)
purchaseRouter.delete("/:id", purchaseController.deletePurchase)