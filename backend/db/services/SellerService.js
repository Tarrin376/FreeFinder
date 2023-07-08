import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";
import { sellerProperties } from '../utils/sellerProperties.js';

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
            throw new DBError("Something went wrong when trying to find this seller. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function createSeller(id) {
    try {
        const newSeller = await prisma.sellerLevel.findFirst({ where: { xpRequired: 0 } });
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
            throw new DBError("Something went wrong when trying to make you a seller. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateSellerDetailsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.params.username);
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
            throw new DBError("Something went wrong when trying update your seller details. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSellerDetailsHandler(username) {
    try {
        const sellerDetails = await prisma.seller.findMany({
            where: {
                user: {
                    username: username
                }
            },
            select: {
                rating: true,
                reviews: {
                    select: {
                        reviewer: {
                            select: {
                                username: true,
                                country: true
                            }
                        },
                        reviewBody: true,
                        createdAt: true,
                        rating: true,
                        postID: true
                    }
                },
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
                                isThumbnail: true
                            },
                            orderBy: {
                                isThumbnail: 'desc'
                            }
                        }
                    }
                },
                description: true,
                summary: true,
                _count: {
                    select: { 
                        reviews: true
                    }
                },
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
            throw new DBError("Something went wrong when trying get this seller's details. Please try again.", 500);
        }
    }
}

export async function getSellersHandler(search, limit) {
    try {
        const sellers = await prisma.seller.findMany({
            take: limit ? parseInt(limit) : undefined,
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
            },
            orderBy: {
                reviews: {
                    _count: 'desc'
                }
            }
        });
        
        return sellers;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying find sellers. Please try again.", 500);
        }
    }
}