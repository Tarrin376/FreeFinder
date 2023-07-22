import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { sellerProperties } from '../utils/sellerProperties.js';
import { sortReviews } from '../utils/sortReviews.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { getAvgRatings } from '../utils/getAvgRatings.js';
import { countReviewRating } from '../utils/countReviewRating.js';

export async function findSeller(userID) {
    try {
        const seller = await prisma.seller.findUnique({ 
            where: { 
                userID: userID 
            },
            select: {
                ...sellerProperties.select,
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        if (!seller) {
            const newSeller = await createSeller(userID);
            return newSeller;
        } else {
            return seller;
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function createSeller(id) {
    try {
        const newSeller = await prisma.sellerLevel.findFirst({ where: { xpRequired: 5000 } });
        if (!newSeller) {
            throw new DBError("Newbie seller level does not exist.", 400);
        }

        const seller = await prisma.seller.create({
            data: {
                userID: id,
                rating: 0,
                description: "",
                summary: "",
                sellerLevelID: newSeller.id
            },
            select: {
                ...sellerProperties.select,
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        return seller;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("You are already a seller.", 409);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateSellerDetailsHandler(req) {
    try {
        const user = await prisma.seller.findUnique({ 
            where: {
                sellerID: req.params.sellerID
            },
            select: {
                userID: true
            }
        });

        if (req.userData.userID !== user.userID) {
            throw new DBError("You are not authorized to perform this action.", 403);
        }

        const updatedDetails = await prisma.seller.update({
            where: {
                userID: req.userData.userID
            },
            data: {
                description: req.body.description,
                languages: req.body.languages,
                summary: req.body.summary,
                skills: req.body.skills
            },
            ...sellerProperties,
        });

        return updatedDetails;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Seller not found.", 404);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSellerDetailsHandler(sellerID) {
    try {
        const sellerDetails = await prisma.seller.findMany({
            where: {
                sellerID: sellerID
            },
            select: {
                rating: true,
                sellerID: true,
                posts: {
                    take: 10,
                    select: {
                        postedBy: {
                            select: {
                                user: {
                                    select: {
                                        profilePicURL: true,
                                        status: true,
                                        username: true
                                    }
                                },
                                rating: true,
                                sellerLevel: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        createdAt: true,
                        _count: {
                            select: { 
                                reviews: true
                            }
                        },
                        startingPrice: true,
                        title: true,
                        postID: true,
                        images: {
                            select: {
                                url: true,
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                },
                description: true,
                summary: true,
                languages: true,
                skills: true,
                sellerLevel: {
                    select: {
                        name: true
                    }
                },
                user: {
                    select: {
                        profilePicURL: true,
                        status: true,
                        username: true,
                        country: true,
                        memberDate: true
                    }
                }
            }
        });
        
        if (sellerDetails.length === 1) {
            return sellerDetails[0];
        } else {
            throw new DBError("Seller not found.", 404);
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSellersHandler(search, limit, cursor) {
    try {
        const sellers = await querySellers(search, limit, cursor);
        return sellers;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function querySellers(search, limit, cursor) {
    const query = {
        take: limit ? limit : undefined,
        skip: cursor ? 1 : undefined,
        cursor: cursor ? { sellerID: cursor } : undefined,
        where: {
            user: {
                username: search ? {
                    contains: search,
                    mode: 'insensitive'
                } : undefined
            }
        },
        select: {
            user: {
                select: {
                    username: true,
                    profilePicURL: true,
                    country: true,
                    status: true,
                }
            },
            sellerLevel: {
                select: {
                    name: true
                }
            },
            summary: true,
            sellerID: true
        },
        orderBy: {
            sellerID: 'asc'
        }
    };

    const [sellers, count] = await prisma.$transaction([
        prisma.seller.findMany(query),
        prisma.seller.count({
            where: {
                user: {
                    username: search ? {
                        contains: search,
                        mode: 'insensitive'
                    } : undefined
                }
            }
        })
    ]);

    if (sellers.length === 0) {
        return { 
            next: [],
            cursor: undefined, 
            last: true,
            count: count
        };
    }
    
    const minNum = Math.min(isNaN(limit) ? sellers.length - 1 : limit - 1, sellers.length - 1);
    return {
        next: sellers, 
        cursor: sellers[minNum].sellerID, 
        last: isNaN(limit) || minNum < limit - 1,
        count: count
    };
}

export async function getReviewsHandler(req) {
    try {
        const options = {
            orderBy: sortReviews[req.query.sort],
        };

        const filters = {
            postID: req.query.post,
            sellerID: req.params.sellerID,
            isOldReview: req.query.include_old === "true" ? undefined : false,
            reviewer: {
                username: req.query.reviewer
            }
        };
    
        const select = {
            reviewID: true,
            sellerID: true,
            reviewer: {
                select: {
                    username: true,
                    country: true,
                    memberDate: true,
                    status: true,
                    profilePicURL: true,
                }
            },
            reviewBody: true,
            createdAt: true,
            rating: true,
            postID: true,
            _count: {
                select: {
                    foundHelpful: true
                }
            }
        };
    
        const result = await getPaginatedData(
            filters, 
            select, 
            "review",
            req.body.limit, 
            { reviewID: req.body.cursor }, 
            "reviewID",
            options
        );
        
        let averages = {};
        if (!req.body.cursor) {
            averages = (await getAvgRatings(req.query.post, req.params.sellerID))._avg;
            const promises = new Array(5).fill(0).map((_, index) => countReviewRating(index + 1, req.query.post, req.params.sellerID).then(x => x));
            const starCounts = await Promise.all(promises).then((stars) => stars);
        
            return { 
                ...result, 
                averages: averages,
                starCounts: starCounts
            } 
        }

        return { 
            ...result, 
        } 
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
}