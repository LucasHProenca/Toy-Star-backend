import z from "zod"

export interface CreatePurchaseInputDTO {
    products:{
        id: string,
        quantity: number
    }[],
    token: string
}

export type CreatePurchaseOutputDTO = undefined

export const CreatePurchaseSchema = z.object({
    products: z.object({
        id: z.string().min(1),
        quantity: z.number().min(1)
    }).array(),
    token: z.string().min(1)
}).transform(data => data as CreatePurchaseInputDTO)