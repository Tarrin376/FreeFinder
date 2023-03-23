import { PrismaClient, Prisma } from '@prisma/client';
import { paginationLimit } from '../index.js';
import bcrypt from 'bcrypt';
import { env } from 'process';
import pkg from 'cloudinary';

export const prisma = new PrismaClient();
const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY
});

export async function updateProfilePictureHandler(userID, file) {
    const upload = cloudinary.uploader.upload(file, { public_id: `FreeFinder/ProfilePictures/${userID}` });
    
    const success = await upload.then((data) => data)
    .catch((err) => {
        throw err;
    });

    try {
        await prisma.user.update({
            where: { userID: userID },
            data: { profilePicURL: success.secure_url }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updatePasswordHandler(userID, password) {
    const hash = await bcrypt.hash(password, 10);
    
    try {
        await prisma.user.update({
            where: { userID: userID },
            data: { hash: hash }
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2025') {
                throw new Error("User could not be found.");
            }
        } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function addUserHandler(userData) {
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
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error("There already exists a user with this username or email address.");
            }
        } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
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
                        sellerID: true
                    }
                },
            }
        });
        
        if (!res) {
            throw new Error("Email or username provided doesn't have any account linked to it.");
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            throw new Error("Password entered is incorrect. Ensure that you have entered it correctly.");
        } else {
            const {hash, ...filtered} = res;
            return filtered;
        }
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateUserHandler(data) {
    const {seller, ...res} = data;
    const userData = res;
    
    try {
        const updated = await prisma.user.update({
            where: { userID: userData.userID },
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

        const {hash, password, ...res} = updated;
        return res;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error("There already exists a user with this username or email address.");
            }
        } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteUserHandler(userID) {
    try {
        await prisma.user.delete({ where: { userID: userID } });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getSavedPostsHandler(userID, cursor) {
    try {
        if (!cursor) return firstQuerySavedPosts(userID);
        else return secondQuerySavedPosts(userID, cursor);
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function firstQuerySavedPosts(userID) {
    try {
        const saved = await prisma.savedPost.findMany({
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
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function secondQuerySavedPosts(userID, cursor) {
    try {
        const saved = await prisma.savedPost.findMany({
            skip: 1,
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
        if (err instanceof Prisma.PrismaClientUnknownRequestError) {
            throw new Error("Something went wrong when trying to process your request. Please try again.");
        } else {
            throw err;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}