import { Request, Response } from "express";
import { ZodError } from "zod";
import { PurchaseBusiness } from "../business/PurchaseBusiness";
import { CreatePurchaseSchema } from "../dtos/purchasesDtos/createPurchase.dto";
import { DeletePurchaseSchema } from "../dtos/purchasesDtos/deletePurchase.dto";
import { GetPurchaseSchema } from "../dtos/purchasesDtos/getPurchase.dto";
import { BaseError } from "../errors/BaseError";

export class PurchasesController {
    constructor(
        private purchasesBusiness: PurchaseBusiness
    ) { }

    public getPurchases = async (req: Request, res: Response) => {
        try {
            const input = GetPurchaseSchema.parse({
                purchase_id: req.params.id,
                token: req.headers.authorization
            })
            const output = await this.purchasesBusiness.getPurchase(input)

            res.status(200).send(output)
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

    public deletePurchase = async (req: Request, res: Response) => {
        try {
            const input = DeletePurchaseSchema.parse({
                purchase_id: req.params.id,
                token: req.headers.authorization
            })
            const output = await this.purchasesBusiness.deletePurchase(input)

            res.status(200).send(output)
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