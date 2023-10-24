import z from "zod"

export interface PutLikeProductInputDTO {
    product_id: string,
    token: string
    like: boolean
}

export type PutLikeProductOutputDTO = undefined

export const PutLikeProductSchema = z.object({
    product_id: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean()
}).transform(data => data as PutLikeProductInputDTO)