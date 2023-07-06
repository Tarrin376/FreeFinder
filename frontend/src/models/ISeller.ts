export interface ISeller {
    description: string,
    rating: number,
    sellerID: string,
    languages: string[],
    sellerXP: number,
    summary: string,
    sellerLevel: {
        xpRequired: number,
        name: string,
        nextLevel?: {
            xpRequired: number,
            name: string
        }
    }
}