import { prisma } from "./UserService.js";
import { Prisma } from '@prisma/client';
import { paginationLimit } from "../index.js";
import { sortPosts } from "../utils/sortPosts.js";
import { DBError } from "../customErrors/DBError.js";

export async function findSeller(userID) {
    try {
        const seller = await prisma.seller.findUnique({ where: { userID: userID } });
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
        const seller = await prisma.seller.create({
            data: {
                userID: id,
                rating: 0,
                description: "",
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

export async function getSellerPostsHandler(username, cursor, sortBy) {
    try {
        const seller = await prisma.seller.findFirst({ 
            where: { 
                user: {
                    username: username
                }
            }
        });

        if (!seller) {
            return { 
                posts: [],
                cursor: "", 
                last: true
            };
        }

        if (cursor === "") return firstQuerySellerPosts(seller.sellerID, sortBy);
        else return secondQuerySellerPosts(seller.sellerID, cursor, sortBy);
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get this seller's posts. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function firstQuerySellerPosts(sellerID, sortBy) {
    const posts = await prisma.post.findMany({
        take: paginationLimit,
        where: { sellerID: sellerID },
        orderBy: sortPosts[sortBy],
        select: { 
            postedBy: {
                select: {
                    user: {
                        select: {
                            profilePicURL: true,
                            status: true,
                            username: true,
                        }
                    },
                    rating: true,
                },
            },
            createdAt: true,
            numReviews: true,
            startingPrice: true,
            title: true,
            postID: true,
            images: {
                where: {
                    imageNum: 0
                }
            }
        }
    });

    if (posts.length === 0) {
        return { 
            posts,
            cursor: "", 
            last: true
        };
    }
    
    const minNum = Math.min(paginationLimit - 1, posts.length - 1);
    return { 
        posts, 
        cursor: posts[minNum].postID, 
        last: minNum < paginationLimit - 1 
    };
}

export async function secondQuerySellerPosts(sellerID, cursor, sortBy) {
    const posts = await prisma.post.findMany({
        skip: 1,
        take: paginationLimit,
        orderBy: sortPosts[sortBy],
        cursor: { 
            postID: cursor
        },
        where: { 
            sellerID: sellerID 
        },
        select: { 
            postedBy: {
                select: {
                    user: {
                        select: {
                            profilePicURL: true,
                            status: true,
                            username: true,
                        }
                    },
                    rating: true,
                },
            },
            createdAt: true,
            numReviews: true,
            startingPrice: true,
            title: true,
            postID: true,
            images: {
                where: {
                    imageNum: 0
                }
            }
        }
    });

    if (posts.length === 0) {
        return { 
            posts, 
            cursor, 
            last: true
        };
    }

    const minNum = Math.min(paginationLimit - 1, posts.length - 1);
    return { 
        posts, 
        cursor: posts[minNum].postID, 
        last: minNum < paginationLimit - 1
    };
}

export async function updateSellerDetailsHandler(req) {
    if (req.params.userID !== req.userData.userID) {
        throw new DBError("You are not authorized to update this user's seller details.", 403);
    }

    try {
        const updatedDetails = await prisma.seller.update({
            where: {
                userID: req.userData.userID
            },
            data: {
                description: req.body.description
            },
            select: {
                sellerID: true,
                description: true,
                rating: true,
            }
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
            throw new DBError("Something went wrong when trying to process your request. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}