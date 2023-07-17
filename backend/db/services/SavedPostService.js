import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { sortPosts } from '../utils/sortPosts.js';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";
import { getPostFilters } from '../utils/getPostFilters.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';

async function getSavedPostIDs(userID) {
    try {
        const savedPosts = await prisma.savedPost.findMany({
            where: {
                userID: userID
            },
            select: {
                postID: true
            }
        });
    
        const savedPostIDs = savedPosts.map((post) => post.postID);
        return savedPostIDs;
    }
    catch (err) {
        throw new DBError("Something went wrong when trying to perform this action. Please try again.", 500);
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function savePostHandler(postID, userID, username) {
    try {
        await checkUser(userID, username);
        await prisma.savedPost.create({
            data: {
                userID: userID,
                postID: postID
            }
        });

        const savedPostIDs = await getSavedPostIDs(userID);
        return savedPostIDs;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("Post already saved.", 409);
        } else {
            throw new DBError("Something went wrong when trying to save this post. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSavedPostsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        return await querySavedPosts(req);
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get your saved posts. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function querySavedPosts(req) {
    const where = {
        post: { ...getPostFilters(req) }
    };

    const select = {
        post: {
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
                        url: true
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        }
    };

    const options = {
        orderBy: {
            post: sortPosts[req.body.sort]
        }
    };

    const cursor = req.body.cursor ? { 
        userID_postID: {
            userID: req.userData.userID,
            postID: req.body.cursor
        }
    } : {};

    const result = await getPaginatedData(
        where, 
        select, 
        "savedPost", 
        req.body.limit, 
        cursor, 
        "userID_postID", 
        options
    );

    return {
        ...result,
        next: result.next.map((x) => x.post)
    }
}

export async function deleteSavedPostHandler(postID, userID, username) {
    try {
        await checkUser(userID, username);
        await prisma.savedPost.delete({
            where: {
                userID_postID: {
                    userID: userID,
                    postID: postID
                }
            }
        });

        const savedPostIDs = await getSavedPostIDs(userID);
        return savedPostIDs;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Post not found.", 404);
        } else {
            throw new DBError("Something went wrong when trying to delete this post. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}