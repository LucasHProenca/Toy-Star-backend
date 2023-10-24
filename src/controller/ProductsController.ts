import { ProductBusiness } from "../business/ProductBusiness";
import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetProductSchema } from "../dtos/productsDtos/getProduct.dto";
import { CreateProductSchema } from "../dtos/productsDtos/createProduct.dto";
import { EditProductSchema } from "../dtos/productsDtos/editProduct.dto";
import { DeleteProductSchema } from "../dtos/productsDtos/deleteProduct.dto";
import { GetProductLikeSchema } from "../dtos/productsDtos/getFavoriteProduct.dto";
import { PutLikeProductSchema } from "../dtos/productsDtos/putLikeProduct.dto";

export class ProductsController {
    constructor(
        private productBusiness: ProductBusiness
    ) { }

    public getProducts = async (req: Request, res: Response) => {
        try {
            const input = GetProductSchema.parse({
                q: req.query.q,
                token: req.headers.authorization
            })

            const output = await this.productBusiness.getProducts(input)

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

    public createProduct = async (req: Request, res: Response) => {
        try {
            const input = CreateProductSchema.parse({
                token: req.headers.authorization,
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                imageUrl: req.body.imageUrl
            })
            const output = await this.productBusiness.createProduct(input)

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

    public editProduct = async (req: Request, res: Response) => {
        try {
            const input = EditProductSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                imageUrl: req.body.imageUrl
            })
            const output = await this.productBusiness.editProduct(input)

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

    public deleteProducts = async (req: Request, res: Response) => {
        try {
            const input = DeleteProductSchema.parse({
                id: req.params.id,
                token: req.headers.authorization
            })
            const output = await this.productBusiness.deleteProducts(input)

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

    public putLikeProduct = async (req: Request, res: Response) => {
        try {
            const input = PutLikeProductSchema.parse({
                product_id: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            })
            const output = await this.productBusiness.likeProduct(input)

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

    public getFavoriteProducts = async (req: Request, res: Response) => {
        try {
            const input = GetProductLikeSchema.parse({
                product_id: req.params.id,
                token: req.headers.authorization
            })
            const output = await this.productBusiness.getFavoriteProduct(input)

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