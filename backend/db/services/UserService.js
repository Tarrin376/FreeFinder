import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from 'process';
import pkg from 'cloudinary';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { paginationLimit } from "../index.js";
import { sortPosts } from '../utils/sortPosts.js';

export const prisma = new PrismaClient();
export const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY
});

export async function updateProfilePictureHandler(req) {
    try {
        checkUser(req.userData.userID, req.username);
        const upload = cloudinary.uploader.upload(req.body.profilePic, { public_id: `FreeFinder/ProfilePictures/${req.userData.userID}` });
        const success = await upload.then((data) => data);
        
        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { profilePicURL: success.secure_url },
            include: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true
                    }
                },
            }
        });

        const {hash, password, ...res} = updated;
        return res;
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
        checkUser(req.userData.userID, req.username);
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
                    }
                },
            }
        });
        
        if (!res) {
            throw new DBError("Email or username provided doesn't have any account linked to it.", 404);
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            throw new DBError("Password entered is incorrect. Ensure that you have entered it correctly.", 403)
        } else {
            const {hash, ...filtered} = res;
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
        checkUser(req.userData.userID, req.username);
        const {seller, ...res} = req.body;
        const userData = res;

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { ...userData },
            include: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true
                    }
                },
            }
        });

        const {hash, password, ...filtered} = updated;
        return filtered;
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
        checkUser(req.userData.userID, req.username);
        await prisma.user.delete({ 
            where: { 
                userID: req.userData.userID 
            } 
        });
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
                cursor: "", 
                last: true
            };
        }

        if (req.body.cursor === "") return firstQueryUserPosts(seller.sellerID, req.query.sort);
        else return secondQueryUserPosts(seller.sellerID, req.body.cursor, req.query.sort);
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

export async function firstQueryUserPosts(sellerID, sortBy) {
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

export async function secondQueryUserPosts(sellerID, cursor, sortBy) {
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