export interface ISeller {
    description: string,
    rating: number,
    sellerID: string,
    languages: string[],
    sellerXP: number,
    sellerLevel: {
        xpRequired: number,
        name: string,
        nextLevel?: {
            xpRequired: number,
            name: string
        }
    }
}