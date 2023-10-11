import z from "zod"

export interface DeleteProductInputDTO {
    id: string,
    token: string
}

export type DeleteProductOutputDTO = undefined

export const DeleteProductSchema = z.object({
    id: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as DeleteProductInputDTO)