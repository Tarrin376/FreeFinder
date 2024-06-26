import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { groupPreviewProperties } from '../utils/groupPreviewProperties.js';
import { formatGroup } from '../utils/formatGroup.js';
import { deleteMessageGroupFiles } from '../utils/deleteMessageGroupFiles.js';

async function addMembers(members, group, tx, userID, username, createGroup) {
    let allMembers = [];
    for (const member of members) {
        const user = await prisma.user.findUnique({
            where: { username: member },
            select: { 
                socketID: true,
                notificationSettings: true,
                userID: true
            }
        });

        const newMember = await tx.groupMember.create({
            data: {
                group: { connect: { groupID: group.groupID } },
                user: { connect: { username: member } }
            },
            select: {
                unreadMessages: true,
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

        if (user.notificationSettings.mentionsAndReplies && user.userID !== userID && createGroup) {
            const notification = await tx.notification.create({
                data: {
                    userID: user.userID,
                    title: "Added to new group",
                    text: `You were added into the group '${group.groupName}' by ${username}.`
                }
            });

            await tx.user.update({
                where: { userID: user.userID },
                data: {
                    unreadNotifications: { increment: 1 }
                }
            });

            allMembers.push({
                member: newMember,
                notification: notification,
                socketID: user.socketID
            });
        } else {
            allMembers.push({
                member: newMember,
                socketID: user.socketID
            });
        }
    }

    return allMembers;
}

export async function createMessageGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const post = await prisma.post.findUnique({
            where: { postID: req.body.postID },
            select: {
                hidden: true,
                postedBy: {
                    select: {
                        userID: true
                    }
                }
            }
        });

        if (post == null) {
            throw new DBError("Service does not exist or has been deleted.", 404);
        } else if (post.postedBy.userID === req.userData.userID) {
            throw new DBError("You cannot create a message group for your own service.", 400);
        } else if (post.hidden) {
            throw new DBError("You cannot create a message group for a hidden service.", 403);
        }

        return await prisma.$transaction(async (tx) => {
            const group = await tx.messageGroup.create({
                select: { ...groupPreviewProperties },
                data: {
                    groupName: req.body.groupName,
                    postID: req.body.postID,
                    creatorID: req.userData.userID
                }
            });

            const allMembers = await addMembers(req.body.members, group, tx, req.userData.userID, req.username, true);
            return {
                group: {
                    ...formatGroup(group),
                    members: allMembers.map((x) => x.member)
                },
                notis: allMembers.map((x) => {
                    return {
                        socketID: x.socketID,
                        notification: x.notification
                    }
                }).filter((x) => x.socketID != null)
            };
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            throw new DBError("You have already created a group for this service.", 409);
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

export async function deleteMessageGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const group = await prisma.messageGroup.findUnique({
            where: { groupID: req.params.groupID },
            select: { 
                creatorID: true,
                groupID: true,
                members: {
                    select: { 
                        userID: true,
                        unreadMessages: true
                    }
                }
            }
        });

        const pendingOrderRequest = await prisma.orderRequest.findFirst({
            where: {
                status: "PENDING",
                message: {
                    groupID: req.params.groupID
                }
            },
            select: { 
                userID: true,
                total: true
            }
        });

        if (group == null) {
            throw new DBError("Group does not exist.", 404);
        } else if (group.creatorID !== req.userData.userID) {
            throw new DBError("You are not the creator of this group.", 403);
        }

        await prisma.$transaction(async (tx) => {
            for (const member of group.members) {
                await tx.user.update({
                    where: { userID: member.userID },
                    data: {
                        unreadMessages: { decrement: member.unreadMessages }
                    }
                });
            }

            if (pendingOrderRequest != null) {
                await tx.user.update({
                    where: { userID: pendingOrderRequest.userID },
                    data: {
                        balance: { increment: parseFloat(pendingOrderRequest.total) }
                    }
                });
            }

            await tx.messageGroup.delete({ where: { groupID: req.params.groupID } });
            await deleteMessageGroupFiles(`FreeFinder/MessageFiles/${group.groupID}`);
        });
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

export async function updateMessageGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        return await prisma.$transaction(async (tx) => {
            const group = await tx.messageGroup.update({
                where: { groupID: req.params.groupID },
                data: { groupName: req.body.groupName },
                select: { ...groupPreviewProperties }
            });
    
            if (req.body.members) {
                const allMembers = await addMembers(req.body.members, group, tx);
                return {
                    group: {
                        ...formatGroup(group),
                        members: [...group.members, ...allMembers.map((x) => x.member)]
                    },
                    sockets: allMembers.map((x) => x.socketID).filter((socketID) => socketID != null)
                };
            }
    
            return {
                group: group,
                sockets: []
            };
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function removeUserHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        await prisma.groupMember.delete({
            where: {
                groupID_userID: {
                    groupID: req.params.groupID,
                    userID: req.params.removeUserID
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}