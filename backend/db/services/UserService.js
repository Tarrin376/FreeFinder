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
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { getAvgRatings } from '../utils/getAvgRatings.js';
import { groupPreviewProperties } from '../utils/groupPreviewProperties.js';

const MAX_AMOUNT = 500;

export async function updateProfilePictureHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        let result = "";

        if (req.body.profilePic !== "") {
            result = await new Promise(async (resolve, reject) => {
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
        } else {
            await deleteCloudinaryResource(`FreeFinder/ProfilePictures/${req.userData.userID}`, "file");
        }

        const updated = await prisma.user.update({
            where: { userID: req.userData.userID },
            data: { profilePicURL: result.secure_url || "" },
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
            throw new DBError("Something went wrong when trying to process this request.", 500);
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
            throw new DBError("Something went wrong when trying to process this request.", 500)
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
            throw new DBError("Something went wrong when trying to process this request.", 500)
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
        throw new DBError("Something went wrong when trying to process this request.", 500);
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
            throw new DBError("Something went wrong when trying to process this request.", 500);
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
            throw new DBError("Something went wrong when trying to process this request.", 500);
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
            throw new DBError("Something went wrong when trying to process this request.", 500);
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
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

async function queryUserPosts(req) {
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

export async function getBalanceHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const data = await prisma.user.findUnique({
            where: {
                userID: req.userData.userID
            },
            select: {
                balance: true
            }
        });

        return data.balance;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
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
            where: {
                userID: req.userData.userID
            },
            data: {
                balance: {
                    increment: req.body.amount
                }
            },
            select: {
                balance: true
            }
        });

        return updated.balance;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getMessageGroupsHandler(req) {
    try {
        return await queryMessageGroups(req);
    }
    finally {
        await prisma.$disconnect();
    }
}

async function queryMessageGroups(req) {
    await checkUser(req.userData.userID, req.username);

    const where = {
        userID: req.userData.userID
    };

    const select = {
        group: {
            ...groupPreviewProperties
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

async function addMembers(members, groupID, tx) {
    let allMembers = [];

    for (const member of members) {
        const socket = await prisma.user.findUnique({
            where: {
                username: member
            },
            select: {
                socketID: true
            }
        });

        const newMember = await tx.groupMember.create({
            data: {
                group: {
                    connect: {
                        groupID: groupID
                    }
                },
                user: {
                    connect: {
                        username: member
                    }
                }
            },
            select: {
                user: {
                    select: {
                        username: true,
                        profilePicURL: true,
                        status: true,
                        userID: true
                    }
                }
            }
        });

        allMembers.push({
            member: newMember,
            socketID: socket.socketID
        });
    }

    return allMembers;
}

export async function createMessageGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        if (!Array.isArray(req.body.members) || req.body.members.length === 0 || typeof req.body.members[0] !== "string") {
            throw new DBError("Members must be a non-empty string array.", 400);
        }
       
        return await prisma.$transaction(async (tx) => {
            const group = await tx.messageGroup.create({
                data: {
                    groupName: req.body.groupName,
                    postID: req.body.postID,
                    creatorID: req.userData.userID
                },
                ...groupPreviewProperties
            });

            const allMembers = await addMembers(req.body.members, group.groupID, tx);
            return {
                group: {
                    ...group,
                    members: allMembers.map((x) => x.member)
                },
                sockets: allMembers.map((x) => x.socketID).filter((socketID) => socketID !== null)
            }
        });
    }
    catch (err) {
        console.log(err);
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            throw new DBError("One or more members are already in a group for this service.", 409);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getMessagesHandler(req) {
    try {
        return await queryMessages(req);
    }
    finally {
        await prisma.$disconnect();
    }
}

async function queryMessages(req) {
    await checkUser(req.userData.userID, req.username);

    const where = {
        groupID: req.params.groupID
    };

    const options = {
        orderBy: {
            createdAt: 'desc'
        }
    };

    const select = {
        from: {
            select: {
                username: true,
                profilePicURL: true,
                status: true
            }
        },
        messageText: true,
        createdAt: true,
        messageID: true
    };

    const result = await getPaginatedData(
        where, 
        select, 
        "message", 
        req.body.limit, 
        { messageID: req.body.cursor }, 
        "messageID", 
        options
    );

    return result;
}

export async function sendMessageHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const newMessage = await prisma.message.create({
            data: {
                fromID: req.userData.userID,
                groupID: req.params.groupID,
                messageText: req.body.message
            },
            select: {
                from: {
                    select: {
                        username: true,
                        profilePicURL: true,
                        status: true
                    }
                },
                messageText: true,
                createdAt: true,
                messageID: true
            }
        });

        return newMessage;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function removeUserFromGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        await prisma.groupMember.delete({
            where: {
                groupID_userID: {
                    groupID: req.params.groupID,
                    userID: req.params.userToDelete
                }
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("User was not found in this group or the group does not exist.", 404);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
}

export async function deleteGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const group = await prisma.messageGroup.findUnique({
            where: {
                groupID: req.params.groupID
            },
            select: {
                creatorID: true
            }
        });

        if (!group) {
            throw new DBError("Group does not exist.", 404);
        }

        if (group.creatorID !== req.userData.userID) {
            throw new DBError("You are not the creator of this group.", 403);
        }

        await prisma.messageGroup.delete({
            where: {
                groupID: req.params.groupID,
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
}

export async function leaveGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        await prisma.groupMember.delete({
            where: {
                groupID_userID: {
                    groupID: req.params.groupID,
                    userID: req.userData.userID
                }
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("You are not in this group or the group does not exist.", 404);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
}

export async function updateGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        return await prisma.$transaction(async (tx) => {
            const group = await tx.messageGroup.update({
                where: {
                    groupID: req.params.groupID
                },
                data: {
                    groupName: req.body.groupName,
                },
                ...groupPreviewProperties
            });
    
            if (Array.isArray(req.body.members) && req.body.members.length > 0 && typeof req.body.members[0] === "string") {
                const allMembers = await addMembers(req.body.members, group.groupID, tx);
                return {
                    group: {
                        ...group,
                        members: allMembers.map((x) => x.member)
                    },
                    sockets: allMembers.map((x) => x.socketID).filter((socketID) => socketID !== null)
                }
            }
    
            return {
                group: group,
                sockets: []
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("Message group not found.", 404);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to process this request.", 500);
        }
    }
}