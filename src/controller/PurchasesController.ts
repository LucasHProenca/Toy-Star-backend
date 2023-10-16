import { Request, Response } from "express";
import { ZodError } from "zod";
import { PurchaseBusiness } from "../business/PurchaseBusiness";
import { CreatePurchaseSchema } from "../dtos/purchasesDtos/createPurchase.dto";
import { BaseError } from "../errors/BaseError";

export class PurchasesController {
    constructor(
        private purchasesBusiness: PurchaseBusiness
    ){}

    public createPurchase = async (req: Request, res: Response) => {
        try {
            const input = CreatePurchaseSchema.parse({
                products: req.body.products, 
                token: req.headers.authorization
            })

            const output = await this.purchasesBusiness.createPurchase(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}