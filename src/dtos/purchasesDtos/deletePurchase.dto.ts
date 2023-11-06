import z from "zod"

export interface DeletePurchaseInputDTO {
    purchase_id: string,
    token: string
}

export type DeletePurchaseOutputDTO = undefined

export const DeletePurchaseSchema = z.object({
    purchase_id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as DeletePurchaseInputDTO)