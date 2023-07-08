export interface ISeller {
    description: string,
    rating: number,
    sellerID: string,
    languages: string[],
    skills: string[],
    sellerXP: number,
    summary: string,
    sellerLevel: {
        xpRequired: number,
        name: string,
        postLimit: number,
        nextLevel?: {
            xpRequired: number,
            name: string
        }
    }
}