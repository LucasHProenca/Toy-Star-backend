import z from "zod"

export interface CreateProductInputDTO {
    token: string,
    name: string,
    price: number,
    description: string,
    imageUrl: string
}

export type CreateProductOutputDTO = undefined

export const CreateProductSchema =z.object({
    token: z.string().min(1),
    name: z.string().min(3),
    price: z.number().min(3),
    description: z.string().min(5).max(100),
    imageUrl: z.string().min(1)
}).transform(data => data as CreateProductInputDTO)