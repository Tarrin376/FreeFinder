import { prisma } from "./UserService.js";
import { Prisma } from '@prisma/client';
import { paginationLimit } from "../index.js";
import { sortPosts } from '../utils/sortPosts.js';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";

export async function savePostHandler(postID, userID, username) {
    try {
        checkUser(userID, username);
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
        checkUser(req.userData.userID, req.username);
        if (req.query.cursor === "HEAD") return firstQuerySavedPosts(req.userData.userID, req.query.sort);
        else return secondQuerySavedPosts(req.userData.userID, req.query.cursor, req.query.sort);
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

export async function firstQuerySavedPosts(userID, sortBy) {
    const saved = await prisma.savedPost.findMany({
        take: paginationLimit,
        where: {
            userID: userID
        },
        orderBy: {
            post: sortPosts[sortBy]
        },
        select: {
            post: {
                include: {
                    postedBy: {
                        select: {
                            user: {
                                select: {
                                    profilePicURL: true,
                                    status: true,
                                    username: true,
                                    userID: true,
                                }
                            },
                            rating: true,
                            description: true,
                            numReviews: true
                        }
                    },
                    images: {
                        orderBy: {
                            imageNum: 'asc'
                        }
                    }
                }
            }
        }
    });

    if (saved.length === 0) {
        return { 
            posts: saved, 
            cursor: "HEAD", 
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

export async function secondQuerySavedPosts(userID, cursor, sortBy) {
    const saved = await prisma.savedPost.findMany({
        skip: 1,
        orderBy: {
            post: sortPosts[sortBy]
        },
        where: {
            userID: userID
        },
        cursor: { 
            userID_postID: {
                userID: userID,
                postID: cursor
            }
        },
        take: paginationLimit,
        select: {
            post: {
                include: {
                    postedBy: {
                        select: {
                            user: {
                                select: {
                                    profilePicURL: true,
                                    status: true,
                                    username: true,
                                    userID: true,
                                }
                            },
                            rating: true,
                            description: true,
                            numReviews: true
                        }
                    },
                    images: {
                        orderBy: {
                            imageNum: 'asc'
                        }
                    }
                }
            }
        }
    });

    if (saved.length === 0) {
        return { 
            posts: saved, 
            cursor, 
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
        checkUser(userID, username);
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