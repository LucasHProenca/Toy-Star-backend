import z from "zod"

export interface EditProductInputDTO {
    id: string,
    token: string,
    name?: string,
    price?: number,
    description?: string,
    imageUrl?: string
}

export type EditProductOutputDTO = undefined

export const EditProductSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1),
    name: z.string().min(3).optional(),
    price: z.number().min(3).optional(),
    description: z.string().min(5).max(100).optional(),
    imageUrl: z.string().min(1).optional()
}).transform(data => data as EditProductInputDTO)