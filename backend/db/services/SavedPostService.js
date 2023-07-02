import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { paginationLimit } from "../index.js";
import { sortPosts } from '../utils/sortPosts.js';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";

export async function savePostHandler(postID, userID, username) {
    try {
        await checkUser(userID, username);
        await prisma.savedPost.create({
            data: {
                userID: userID,
                postID: postID
            }
        });
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
        return querySavedPosts(req);
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

export async function querySavedPosts(req) {
    const saved = await prisma.savedPost.findMany({
        skip: req.query.cursor ? 1 : undefined,
        cursor: req.query.cursor ? { 
            userID_postID: {
                userID: req.userData.userID,
                postID: req.query.cursor
            }
        } : undefined,
        take: paginationLimit,
        where: {
            userID: req.userData.userID,
            post: {
                packages: {
                    some: {
                        amount: {
                            gte: req.query.min,
                            lte: req.query.max
                        }
                    }
                },
                postedBy: {
                    user: { 
                        country: req.query.location
                    }
                },
                title: { 
                    contains: req.query.search 
                }
            }
        },
        orderBy: {
            post: sortPosts[req.query.sort]
        },
        select: {
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
                        }
                    },
                    createdAt: true,
                    numReviews: true,
                    startingPrice: true,
                    title: true,
                    postID: true,
                    images: {
                        where: { 
                            isThumbnail: true
                        },
                        select: {
                            url: true,
                            isThumbnail: true
                        }
                    }
                }
            }
        }
    });

    if (saved.length === 0) {
        return { 
            posts: saved, 
            cursor: undefined, 
            last: true
        };
    }

    const minNum = Math.min(paginationLimit - 1, saved.length - 1);
    const posts = saved.map((cur) => cur.post);

    return { 
        posts, 
        cursor: saved[minNum].post.postID,
        last: minNum < paginationLimit - 1 
    };
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