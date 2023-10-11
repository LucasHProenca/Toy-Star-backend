import express from "express"
import { ProductBusiness } from "../business/ProductBusiness"
import { ProductsController } from "../controller/ProductsController"
import { ProductDatabase } from "../database/ProductDatabase"
import { UserDatabase } from "../database/UsersDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const productRouter = express.Router()

const productController = new ProductsController(
    new ProductBusiness(
        new ProductDatabase(),
        new UserDatabase(),
        new TokenManager(),
        new IdGenerator()
    )
)

productRouter.get("/", productController.getProducts)
productRouter.post("/", productController.createProduct)
productRouter.put("/:id", productController.editProduct)
productRouter.delete("/:id", productController.deleteProducts)