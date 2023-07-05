export function getPostFilters(req) {
    return {
        packages: {
            some: {
                amount: {
                    gte: req.body.min,
                    lte: req.body.max
                },
                deliveryTime: {
                    lte: req.body.deliveryTime
                }
            }
        },
        postedBy: {
            user: {
                country: req.body.location
            },
            languages: req.body.languages.length > 0 ? {
                hasSome: req.body.languages
            } : undefined,
            sellerLevel: {
                name: req.body.sellerLevels.length > 0 ? {
                    in: req.body.sellerLevels
                } : undefined
            }
        },
        title: { 
            contains: req.body.search,
            mode: 'insensitive'
        }
    }
}