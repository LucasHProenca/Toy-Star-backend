import { ProductDB, ProductModel } from "../types"

export class Products {
    constructor(
        private id: string,
        private name: string,
        private price: number,
        private description: string,
        private imageUrl: string,
        private creatorId: string,
        private creatorName: string
    ) { }

    public getId(): string {
        return this.id
    }

    public getName(): string {
        return this.name
    }

    public getPrice(): number {
        return this.price
    }

    public getDescription(): string {
        return this.description
    }

    public getImageUrl(): string {
        return this.imageUrl
    }

    public getCreatorId(): string {
        return this.creatorId
    }

    public getCreatorName(): string {
        return this.creatorName
    }

    public setId(value: string): void {
        this.id = value
    }

    public setName(value: string): void {
        this.name = value
    }

    public setPrice(value: number): void {
        this.price = value
    }

    public setDescription(value: string): void {
        this.description = value
    }

    public setImageUrl(value: string): void {
        this.imageUrl = value
    }

    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public setCreatorName(value: string): void {
        this.creatorName = value
    }

    public toProductDB(): ProductDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            name: this.name,
            price: this.price,
            description: this.description,
            image_url: this.imageUrl
        }
    }

    public toProductModel(): ProductModel {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            image_url: this.imageUrl,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }
}