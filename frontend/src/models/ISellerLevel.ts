export interface ISellerLevel {
    xpRequired: number,
    name: string,
    postLimit: number,
    nextLevel?: {
        xpRequired: number,
        name: string
    }
}