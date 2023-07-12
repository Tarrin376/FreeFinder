import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { sortPosts } from '../utils/sortPosts.js';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";
import { getPostFilters } from '../utils/getPostFilters.js';

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
    const postFilters = getPostFilters(req);
    const limit = parseInt(req.body.limit);

    const query = {
        take: limit ? limit : undefined,
        skip: req.body.cursor ? 1 : undefined,
        cursor: req.body.cursor ? { 
            userID_postID: {
                userID: req.userData.userID,
                postID: req.body.cursor
            }
        } : undefined,
        where: {
            userID: req.userData.userID,
            post: {
                ...postFilters
            }
        },
        orderBy: {
            post: sortPosts[req.body.sort]
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
        }
    };

    const [saved, count] = await prisma.$transaction([
        prisma.savedPost.findMany(query),
        prisma.savedPost.count({
            where: {
                userID: req.userData.userID,
                post: {
                    ...postFilters
                }
            }
        })
    ]);

    if (saved.length === 0) {
        return { 
            next: [], 
            cursor: undefined, 
            last: true,
            count: count
        };
    }

    const minNum = Math.min(isNaN(limit) ? saved.length - 1 : limit - 1, saved.length - 1);
    const posts = saved.map((cur) => cur.post);

    return { 
        next: posts, 
        cursor: saved[minNum].post.postID,
        last: isNaN(limit) || minNum < limit - 1,
        count: count
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