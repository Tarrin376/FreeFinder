import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { sortPosts } from '../utils/sortPosts.js';
import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { prisma } from '../index.js';
import { getPostFilters } from '../utils/getPostFilters.js';
import { userProperties } from '../utils/userProperties.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { getAvgRatings } from '../utils/getAvgRatings.js';
import { groupPreviewProperties } from '../utils/groupPreviewProperties.js';
import { uploadFile } from '../utils/uploadFile.js';

const MAX_AMOUNT = 500;

export async function updateProfilePictureHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        let result = "";

        if (req.body.profilePic !== "") {
            result = await uploadFile(req.body.profilePic, `FreeFinder/ProfilePictures/${req.userData.userID}`);
        } else {
            await deleteCloudinaryResource(`FreeFinder/ProfilePictures/${req.userData.userID}`, "image");
        }

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { profilePicURL: result.secure_url || "" },
            select: { ...userProperties }
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updatePasswordHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const hash = await bcrypt.hash(req.body.newPass, 10);

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
            throw new DBError("Something went wrong. Please try again later.", 500)
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
            throw new DBError("Something went wrong. Please try again later.", 500)
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function searchUsersHandler(search, take) {
    try {
        const users = await prisma.user.findMany({
            take: take ? take : undefined,
            where: {
                username: search ? {
                    contains: search,
                    mode: 'insensitive'
                } : undefined
            },
            select: {
                profilePicURL: true,
                username: true,
                status: true,
                userID: true
            }
        });

        return users;
    }
    catch (err) {
        throw new DBError("Something went wrong. Please try again later.", 500);
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

        const { hash, ...filtered } = res;
        return filtered;
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

export async function updateUserHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const { seller, ...res } = req.body;

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { ...res },
            select: { ...userProperties }
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteUserHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        await prisma.$transaction(async (tx) => {
            await tx.user.delete({ where: { userID: req.userData.userID } });
            await deleteCloudinaryResource(`FreeFinder/ProfilePictures/${req.userData.userID}`, "image");
            await deleteCloudinaryResource(`FreeFinder/PostImages/${req.userData.userID}`, "image", true);
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getUserPostsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const postFilters = getPostFilters(req);

        const where = {
            ...postFilters,
            postedBy: {
                ...postFilters.postedBy,
                userID: req.userData.userID
            },
        };

        const select = { 
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
        };

        const options = {
            orderBy: sortPosts[req.body.sort],
        }

        const result = await getPaginatedData(
            where, 
            select, 
            "post", 
            req.body.limit, 
            { postID: req.body.cursor }, 
            "postID", 
            options
        );

        const promises = result.next.map(post => getAvgRatings(post.postID, undefined).then(x => x));
        const postRatings = await Promise.all(promises).then(ratings => ratings);

        const posts = result.next.map((post, index) => {
            return {
                ...post,
                rating: postRatings[index]._avg.rating
            }
        });
        
        return {
            ...result,
            next: posts
        }
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

export async function getBalanceHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const data = await prisma.user.findUnique({
            where: { userID: req.userData.userID },
            select: { balance: true }
        });

        return data.balance;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function addToBalanceHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        if (!req.body.amount || !`${req.body.amount}`.match(new RegExp(`[0-9]+$`))) {
            throw new DBError("Invalid amount or no amount provided.", 400);
        }

        if (req.body.amount > MAX_AMOUNT || req.body.amount < 1) {
            throw new DBError(`Amount must be between 1 and ${MAX_AMOUNT}.`, 400);
        }

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            select: { balance: true },
            data: {
                balance: { increment: req.body.amount }
            }
        });

        return updated.balance;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getMessageGroupsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = { userID: req.userData.userID };

        const select = {
            group: { 
                select: { ...groupPreviewProperties }
            }
        };

        const cursor = req.body.cursor ? { 
            groupID_userID: {
                groupID: req.body.cursor,
                postID: req.userData.userID
            }
        } : {};

        const result = await getPaginatedData(
            where,
            select, 
            "groupMember", 
            req.body.limit, 
            cursor, 
            "groupID_userID", 
        );

        const groups = result.next.map((x) => {
            return {
                ...x.group,
                lastMessage: x.group.messages.length > 0 ? x.group.messages[0] : null
            }
        });

        return {
            ...result,
            next: groups
        }
    }
    finally {
        await prisma.$disconnect();
    }
}