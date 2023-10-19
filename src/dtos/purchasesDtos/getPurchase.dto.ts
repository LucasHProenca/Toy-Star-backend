import z from "zod"
import { PurchaseProductsModel } from "../../types"

export interface GetPurchaseInputDTO {
    purchase_id: string,
    token: string
}

export type GetPurchaseOutputDTO = PurchaseProductsModel[]

export const GetPurchaseSchema = z.object({
    purchase_id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as GetPurchaseInputDTO)