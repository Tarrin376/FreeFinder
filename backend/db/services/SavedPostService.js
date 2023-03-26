import { prisma } from "./UserService.js";
import { Prisma } from '@prisma/client';
import { paginationLimit } from "../index.js";
import { sortByParams } from '../utils/sortByParams.js';

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
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            const error = new Error("Post already saved.");
            error.code = 409;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
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
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function firstQuerySavedPosts(userID, sortBy) {
    try {
        const saved = await prisma.savedPost.findMany({
            take: paginationLimit,
            where: {
                userID: userID
            },
            orderBy: {
                post: sortByParams[sortBy]
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
                        }
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
    catch (err) {
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function secondQuerySavedPosts(userID, cursor, sortBy) {
    try {
        const saved = await prisma.savedPost.findMany({
            skip: 1,
            orderBy: {
                post: sortByParams[sortBy]
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
        const PID = saved[minNum].post.postID;
        const UID = saved[minNum].post.postedBy.user.userID;
        const posts = saved.map((cur) => cur.post);

        return { 
            posts, 
            cursor: { userID: UID, postID: PID },
            last: minNum < paginationLimit - 1
        };
    }
    catch (err) {
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
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
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            const error = new Error("Post not found");
            error.code = 404;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}