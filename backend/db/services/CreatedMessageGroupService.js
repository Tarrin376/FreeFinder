import { deleteCloudinaryResource } from '../utils/deleteCloudinaryResource.js';
import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { groupPreviewProperties } from '../utils/groupPreviewProperties.js';
import { formatGroup } from '../utils/formatGroup.js';

async function addMembers(members, groupID, tx) {
    let allMembers = [];

    for (const member of members) {
        const socket = await prisma.user.findUnique({
            where: { username: member },
            select: { socketID: true }
        });

        const newMember = await tx.groupMember.create({
            data: {
                group: {
                    connect: { groupID: groupID }
                },
                user: {
                    connect: { username: member }
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
        const post = await prisma.post.findUnique({
            where: { postID: req.body.postID },
            select: {
                postedBy: {
                    select: {
                        userID: true
                    }
                }
            }
        });

        if (post.postedBy.userID === req.userData.userID) {
            throw new DBError("You cannot create a message group for your own service.", 400);
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

            const allMembers = await addMembers(req.body.members, group.groupID, tx);
            return {
                group: {
                    ...formatGroup(group),
                    members: allMembers.map((x) => x.member)
                },
                sockets: allMembers.map((x) => x.socketID).filter((socketID) => socketID !== null)
            }
        });
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            throw new DBError("You have already created a group with this seller.", 409);
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
            select: { creatorID: true }
        });

        if (!group) {
            throw new DBError("Group does not exist.", 404);
        }

        if (group.creatorID !== req.userData.userID) {
            throw new DBError("You are not the creator of this group.", 403);
        }

        const messages = await prisma.message.findMany({
            where: { groupID: req.params.groupID },
            select: {
                messageID: true,
                files: {
                    select: {
                        url: true
                    }
                }
            }
        });

        for (const message of messages) {
            await deleteCloudinaryResource(`FreeFinder/MessageFiles/${message.messageID}`, "raw", true);
        }

        await prisma.messageGroup.delete({
            where: { groupID: req.params.groupID }
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
                const allMembers = await addMembers(req.body.members, group.groupID, tx);
                return {
                    group: {
                        ...formatGroup(group),
                        members: [...group.members, ...allMembers.map((x) => x.member)]
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