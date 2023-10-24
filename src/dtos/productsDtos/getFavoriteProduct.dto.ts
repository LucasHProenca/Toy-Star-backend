import z from "zod"

export interface GetProductLikeInputDTO {
    product_id: string
    token: string
}

export type GetProductLikeOutputDTO = {
    user_id: string,
    product_id: string,
    like: number
}

export const GetProductLikeSchema = z.object({
    product_id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as GetProductLikeInputDTO)