import { prisma } from "./UserService.js";
import { Prisma } from '@prisma/client';
import { paginationLimit } from "../index.js";
import { sortPosts } from '../utils/sortPosts.js';
import { DBError } from "../customErrors/DBError.js";

export async function savePostHandler(postID, userID) {
    try {
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

export async function getSavedPostsHandler(userID, cursor, sortBy) {
    try {
        if (cursor.userID === "") return firstQuerySavedPosts(userID, sortBy);
        else return secondQuerySavedPosts(userID, cursor, sortBy);
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientValidationError) {
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
                    images: true
                }
            }
        }
    });

    if (saved.length === 0) {
        return { 
            posts: saved, 
            cursor: { userID: "", postID: "" }, 
            last: true
        };
    }

    const minNum = Math.min(paginationLimit - 1, saved.length - 1);
    const PID = saved[minNum].post.postID;
    const UID = saved[minNum].post.postedBy.user.userID;
    const posts = saved.map((cur) => cur.post);

    return { 
        posts, 
        cursor: { userID: UID, postID: PID },
        last: minNum < paginationLimit - 1 
    };
}

export async function secondQuerySavedPosts(userID, cursor, sortBy) {
    const saved = await prisma.savedPost.findMany({
        skip: 1,
        orderBy: {
            post: sortPosts[sortBy]
        },
        cursor: { 
            userID_postID: {
                userID: cursor.userID,
                postID: cursor.postID
            }
        },
        take: paginationLimit,
        where: {
            userID: userID
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
                    images: true
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
    const PID = saved[minNum].post.postID;
    const UID = saved[minNum].post.postedBy.user.userID;
    const posts = saved.map((cur) => cur.post);

    return { 
        posts, 
        cursor: { userID: UID, postID: PID },
        last: minNum < paginationLimit - 1
    };
    
}

export async function deleteSavedPostHandler(postID, userID) {
    try {
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