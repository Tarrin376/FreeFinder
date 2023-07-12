import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { sortPosts } from '../utils/sortPosts.js';
import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { cloudinary } from '../index.js';
import { prisma } from '../index.js';
import { getPostFilters } from '../utils/getPostFilters.js';
import { sellerProperties } from '../utils/sellerProperties.js';
import { userProperties } from '../utils/userProperties.js';

export async function updateProfilePictureHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        const result = await new Promise(async (resolve, reject) => {
            const upload = cloudinary.uploader.upload(req.body.profilePic, { 
                public_id: `FreeFinder/ProfilePictures/${req.userData.userID}` 
            }, (err, result) => {
                if (err) {
                    reject(new DBError(err.message, err.http_code || 500));
                } else {
                    resolve(result);
                }
            });

            const success = await upload
            .then(data => data)
            .catch(err => reject(new DBError(err.message, err.http_code || 500)));
            return success;
        });

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { profilePicURL: result.secure_url },
            select: {
                seller: {
                    ...sellerProperties,
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
        if (err instanceof Prisma.PrismaClientValidationError) {
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

export async function authenticateUserHandler(usernameOrEmail, password) {
    try {
        const res = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: usernameOrEmail },
                    { username: usernameOrEmail }
                ],
            },
            select: {
                ...userProperties,
                hash: true
            }
        });

        if (!res) {
            throw new DBError("Email or username provided doesn't have any account linked to it.", 404);
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            throw new DBError("The password you entered is incorrect. Check that you entered it correctly.", 403)
        }

        const {savedPosts, savedSellers, hash, ...filtered} = res;
        const savedPostIDs = savedPosts.map((post) => post.postID);
        const savedSellerIDs = savedSellers.map((seller) => seller.sellerID);
        return { ...filtered, savedPosts: savedPostIDs, savedSellers: savedSellerIDs };
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
        const { seller, ...res } = req.body;

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { ...res },
            select: {
                ...userProperties
            }
        });
        
        const { savedPosts, savedSellers, ...filtered } = updated;
        const savedPostIDs = savedPosts.map((post) => post.postID);
        const savedSellerIDs = savedSellers.map((seller) => seller.sellerID);
        return { ...filtered, savedPosts: savedPostIDs, savedSellers: savedSellerIDs };
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
        await prisma.user.delete({ where: { userID: req.userData.userID } });
        await deleteCloudinaryResource(`FreeFinder/ProfilePictures/${req.userData.userID}`, "file");
        await deleteCloudinaryResource(`FreeFinder/PostImages/${req.userData.userID}`, "folder");
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
        await checkUser(req.userData.userID, req.username);
        return await queryUserPosts(req);
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

async function queryUserPosts(req) {
    const postFilters = getPostFilters(req);
    const limit = parseInt(req.body.limit);

    const query = {
        skip: req.body.cursor ? 1 : undefined,
        take: limit ? limit : undefined,
        cursor: req.body.cursor ? { postID: req.body.cursor } : undefined,
        orderBy: sortPosts[req.body.sort],
        where: {
            ...postFilters,
            postedBy: {
                ...postFilters.postedBy,
                userID: req.userData.userID
            },
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
                    url: true,
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    };

    const [posts, count] = await prisma.$transaction([
        prisma.post.findMany(query),
        prisma.post.count({ 
            where: { 
                ...postFilters,
                postedBy: {
                    ...postFilters.postedBy,
                    userID: req.userData.userID
                }
            }
        })
    ]);

    if (posts.length === 0) {
        return { 
            next: [],
            cursor: undefined, 
            last: true,
            count: count
        };
    }
    
    const minNum = Math.min(isNaN(limit) ? posts.length - 1 : limit - 1, posts.length - 1);
    return { 
        next: posts, 
        cursor: posts[minNum].postID, 
        last: isNaN(limit) || minNum < limit - 1,
        count: count 
    };
}