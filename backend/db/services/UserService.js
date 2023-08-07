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
import { uploadFile } from '../utils/uploadFile.js';
import { MAX_DEPOSIT, MIN_PASS_LENGTH, MAX_PASS_LENGTH, EMAIL_REGEX, MAX_PROFILE_PIC_BYTES } from '@freefinder/shared/dist/constants.js';

export async function updatePasswordHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        if (!req.body.newPass || req.body.newPass < MIN_PASS_LENGTH || req.body.newPass > MAX_PASS_LENGTH) {
            throw new DBError(`Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters long.`, 400);
        }

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
        if (!userData.password || userData.password < MIN_PASS_LENGTH || userData.password > MAX_PASS_LENGTH) {
            throw new DBError(`Password must be between ${MIN_PASS_LENGTH} and ${MAX_PASS_LENGTH} characters long.`, 400);
        } else if (!userData.email || userData.email.match(EMAIL_REGEX) === null) {
            throw new DBError("Email address must be provided and valid.", 400);
        }

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
        let result = undefined;
        
        if (req.body.profilePic === "") {
            await deleteCloudinaryResource(`FreeFinder/ProfilePictures/${req.userData.userID}`, "image");
            result = "";
        } else if (req.body.profilePic) {
            result = await uploadFile(req.body.profilePic, `FreeFinder/ProfilePictures/${req.userData.userID}`, MAX_PROFILE_PIC_BYTES, "image");
        }

        const updated = await prisma.user.update({
            select: { ...userProperties },
            where: { userID: req.userData.userID },
            data: { 
                profilePicURL: result ? result.secure_url : result,
                username: req.body.username,
                country: req.body.country,
                status: req.body.status,
                email: req.body.email
            }
        });
        
        return updated;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
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

        return parseFloat(data.balance);
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
        } else if (req.body.amount > MAX_DEPOSIT || req.body.amount < 1) {
            throw new DBError(`Amount must be between 1 and ${MAX_DEPOSIT}.`, 400);
        }

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            select: { balance: true },
            data: {
                balance: { increment: req.body.amount }
            }
        });

        return parseFloat(updated.balance);
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("User not found.", 404);
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

export async function createOrderHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const orderRequest = await prisma.orderRequest.findUnique({
            where: { id: req.body.orderRequestID },
            select: { 
                status: true,
                sellerID: true,
                total: true,
                subTotal: true,
                packageID: true,
                seller: {
                    select: {
                        userID: true
                    }
                }
            }
        });

        if (!orderRequest) {
            throw new DBError("Order request not found.", 404);
        } else if (orderRequest.seller.userID !== req.userData.userID) {
            throw new DBError("You are not authorized to accept this order request.", 403);
        } else if (orderRequest.status !== "PENDING") {
            throw new DBError("Action has already been taken on this order request.", 409);
        }

        await prisma.$transaction([
            prisma.orderRequest.update({
                where: { id: req.body.orderRequestID },
                data: { status: "ACCEPTED" }
            }),
            prisma.order.create({
                data: {
                    clientID: req.userData.userID,
                    sellerID: orderRequest.sellerID,
                    status: "PENDING",
                    total: orderRequest.total,
                    subTotal: orderRequest.subTotal,
                    packageID: orderRequest.packageID
                }
            })
        ]);
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