import z from "zod"
import { ProductModel } from "../../types"

export interface GetProductInputDTO {
    q?: string,
    token: string
}

export type GetProductOutputDTO = ProductModel[]

export const GetProductSchema = z.object({
    q:z.string().optional(),
    token: z.string().min(1)
}).transform(data => data as GetProductInputDTO)