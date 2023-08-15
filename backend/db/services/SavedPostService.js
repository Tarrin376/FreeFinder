import { prisma } from '../index.js';
import { Prisma } from '@prisma/client';
import { sortPosts } from '../utils/sortPosts.js';
import { DBError } from "../customErrors/DBError.js";
import { checkUser } from "../utils/checkUser.js";
import { getPostFilters } from '../utils/getPostFilters.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { getAvgRatings } from '../utils/getAvgRatings.js';

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
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            // Ignore that the post has already been saved by the user.
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSavedPostsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = {
            post: { 
                ...getPostFilters(req),
                hidden: false
            }
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
                    hidden: true,
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
    
        const promises = result.next.map(cur => getAvgRatings(cur.post.postID, undefined).then(x => x));
        const postRatings = await Promise.all(promises).then(ratings => ratings);
    
        const posts = result.next.map((cur, index) => {
            return {
                ...cur.post,
                rating: postRatings[index]._avg.rating
            };
        });
    
        return {
            ...result,
            next: posts
        };
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
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
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Post not found.", 404);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}