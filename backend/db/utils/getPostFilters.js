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
                country: req.body.country,
                status: req.body.extraFilters ? 
                req.body.extraFilters.includes("Active now") ? "ONLINE" : undefined
                : undefined
            },
            languages: req.body.languages && req.body.languages.length > 0 ? {
                hasSome: req.body.languages
            } : undefined,
            sellerLevel: {
                name: req.body.sellerLevels && req.body.sellerLevels.length > 0 ? {
                    in: req.body.sellerLevels
                } : undefined
            }
        },
        title: { 
            contains: req.body.search,
            mode: 'insensitive'
        },
        workType: {
            name: req.body.selectedWork && req.body.selectedWork.length > 0 ? {
                in: req.body.selectedWork
            } : undefined
        }
    }
}