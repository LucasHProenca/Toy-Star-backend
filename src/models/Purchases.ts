import { PurchaseDB, PurchaseModel } from "../types"


export class Purchases {
    constructor(
        private id: string,
        private buyer: string,
        private totalPrice: number,
        private createdAt: string
    ) {}

    public getId(): string {
        return this.id
    }

    public getBuyer(): string {
        return this.buyer
    }

    public getTotalPrice(): number {
        return this.totalPrice
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setId(value: string): void {
        this.id = value
    }

    public setBuyer(value: string): void {
        this.buyer = value
    }

    public setTotalPrice(value: number): void {
        this.totalPrice = value
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public toPurchaseDB(): PurchaseDB {
        return {
            id: this.id,
            buyer: this.buyer,
            total_price: this.totalPrice,
            created_at: this.createdAt
        }
    }

    // public toPurchaseModel(): PurchaseModel {
    //     return {
    //         id: this.id,
    //         buyer: this.buyer,
    //         products: {
    //             id: this.productId,
    //             quantity: this.productQuantity
    //         }
    //     }
    // }
}