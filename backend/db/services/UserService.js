import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { paginationLimit } from "../index.js";
import { sortPosts } from '../utils/sortPosts.js';
import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { cloudinary } from '../index.js';
import { prisma } from '../index.js';

export async function updateProfilePictureHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        const result = await new Promise(async (resolve, reject) => {
            const upload = cloudinary.uploader.upload(req.body.profilePic, { 
                public_id: `FreeFinder/ProfilePictures/${req.userData.userID}` 
            }, (err, result) => {
                if (err) {
                    reject(new DBError(err.message, err.http_code));
                } else {
                    resolve(result);
                }
            });

            const success = await upload.then((data) => data);
            return success;
        });
        
        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { profilePicURL: result.secure_url },
            select: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true,
                        languages: true,
                        sellerXP: true,
                        sellerLevel: {
                            select: {
                                xpRequired: true,
                                name: true,
                                nextLevel: {
                                    select: {
                                        xpRequired: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                username: true,
                country: true,
                profilePicURL: true,
                email: true,
                status: true,
                userID: true,
                memberDate: true
            }
        });

        return updated;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 413) {
            throw new DBError("Error updating profile picture: File size exceeds limit.", 413);
        } else {
            throw new DBError("Something went wrong when trying to update your profile picture. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updatePasswordHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const hash = await bcrypt.hash(req.body.password, 10);

        await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { hash: hash }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new DBError("User not found.", 404);
        } else {
            throw new DBError("Something went wrong when trying to update your password. Please try again.", 500)
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function registerUserHandler(userData) {
    try {
        await prisma.user.create({
            data: {
                username: userData.username,
                hash: await bcrypt.hash(userData.password, 10),
                country: userData.country,
                email: userData.email,
                status: 'ONLINE',
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("This username or email address is already taken.", 409)
        } else {
            throw new DBError("Something went wrong when trying to register you. Please try again.", 500)
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function findUserHandler(usernameOrEmail, password) {
    try {
        const res = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: usernameOrEmail },
                    { username: usernameOrEmail }
                ],
            },
            include: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true,
                        languages: true,
                        sellerXP: true,
                        sellerLevel: {
                            select: {
                                xpRequired: true,
                                name: true,
                                nextLevel: {
                                    select: {
                                        xpRequired: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if (!res) {
            throw new DBError("Email or username provided doesn't have any account linked to it.", 404);
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            throw new DBError("The password you entered is incorrect. Check that you entered it correctly.", 403)
        } else {
            const {hash, ...filtered} = res;
            console.log(filtered);
            return filtered;
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get this user. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateUserHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const {seller, ...res} = req.body;
        const userData = res;

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { ...userData },
            select: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true,
                        languages: true,
                        sellerXP: true,
                        sellerLevel: {
                            select: {
                                xpRequired: true,
                                name: true,
                                nextLevel: {
                                    select: {
                                        xpRequired: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                username: true,
                country: true,
                profilePicURL: true,
                email: true,
                status: true,
                userID: true,
                memberDate: true
            }
        });

        return updated;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("There already exists a user with this username or email address.", 409);
        } else {
            throw new DBError("Something went wrong when trying update this user. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteUserHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        await deleteCloudinaryResource(`FreeFinder/ProfilePictures/${req.userData.userID}`, "file");
        await deleteCloudinaryResource(`FreeFinder/PostImages/${req.userData.userID}`, "folder");
        await prisma.user.delete({ where: { userID: req.userData.userID } });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("User not found.", 404);
        } else {
            throw new DBError("Something went wrong when trying to delete this user. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getUserPostsHandler(req) {
    try {
        const seller = await prisma.seller.findFirst({ 
            where: { 
                user: {
                    username: req.params.username
                }
            }
        });

        if (!seller) {
            return { 
                posts: [],
                cursor: undefined, 
                last: true
            };
        }
        
        return queryUserPosts(seller.sellerID, req);
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

export async function queryUserPosts(sellerID, req) {
    const posts = await prisma.post.findMany({
        skip: req.body.cursor ? 1 : undefined,
        cursor: req.body.cursor ? { postID: req.body.cursor } : undefined,
        take: paginationLimit,
        orderBy: sortPosts[req.body.sort],
        where: {
            sellerID: sellerID,
            packages: {
                some: {
                    amount: {
                        gte: req.body.min,
                        lte: req.body.max
                    },
                    deliveryTime: {
                        lte: req.body.deliveryTime
                    }
                }
            },
            postedBy: {
                user: {
                    country: req.body.location
                },
                languages: req.body.languages.length > 0 ? {
                    hasSome: req.body.languages
                } : undefined
            },
            title: { 
                contains: req.body.search 
            }
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
                    sellerLevel: {
                        select: {
                            name: true
                        }
                    }
                },
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
    });

    if (posts.length === 0) {
        return { 
            posts,
            cursor: undefined, 
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