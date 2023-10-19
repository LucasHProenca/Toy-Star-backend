import { PurchaseProductsDB, PurchaseProductsModel } from "../types"


export class PurchasesProducts {
    constructor(
        private purchaseId: string,
        private buyerId: string,
        private buyerName: string,
        private buyerEmail: string,
        private totalPrice: number,
        private createdAt: string,
        private productId: string,
        private productName: string,
        private productPrice: number,
        private productDescription: string,
        private productImageUrl: string,
        private productQuantity: number
    ){}

    public getPurchaseId(): string {
        return this.purchaseId
    }

    public getBuyerId(): string {
        return this.buyerId
    }

    public getBuyerName(): string {
        return this.buyerName
    }

    public getBuyerEmail(): string {
        return this.buyerEmail
    }

    public getTotalPrice(): number {
        return this.totalPrice
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public getProductId(): string {
        return this.productId
    }

    public getProductName(): string {
        return this.productName
    }

    public getProductPrice(): number {
        return this.productPrice
    }

    public getProductDescription(): string {
        return this.productDescription
    }

    public getProductImageUrl(): string {
        return this.productImageUrl
    }

    public getProductQuantity(): number {
        return this.productQuantity
    }

    public setPurchaseId(value: string): void {
        this.purchaseId = value
    }

    public setBuyerId(value: string): void {
        this.buyerId = value
    }

    public setBuyerName(value: string): void {
        this.buyerName = value
    }

    public setBuyerEmail(value: string): void {
        this.buyerEmail = value
    }

    public setTotalPrice(value: number): void {
        this.totalPrice = value
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public setProductId(value: string): void {
        this.productId = value
    }

    public setProductName(value: string): void {
        this.productName = value
    }

    public setProductPrice(value: number): void {
        this.productPrice = value
    }

    public setProductDescription(value: string): void {
        this.productDescription = value
    }

    public setProductImageUrl(value: string): void {
        this.productImageUrl = value
    }

    public setProductQuantity(value: number): void {
        this.productQuantity = value
    }

    public toPurchaseProductsDB(): PurchaseProductsDB {
        return {
            purchase_id: this.purchaseId,
            product_id: this.productId,
            quantity: this.productQuantity
        }
    }

    public toPurchaseProductsModel(): PurchaseProductsModel {
        return {
            purchase_id: this.purchaseId,
            buyer_id: this.buyerId,
            buyer_name: this.buyerName,
            buyer_email: this.buyerEmail,
            total_price: this.totalPrice,
            created_at: this.createdAt,
            products: {
                id: this.productId,
                name: this.productName,
                price: this.productPrice,
                description: this.productDescription,
                imageUrl: this.productImageUrl,
                quantity: this.productQuantity
            }
        }
    }
}