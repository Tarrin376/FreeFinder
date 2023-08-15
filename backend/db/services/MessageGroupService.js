import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { groupPreviewProperties } from '../utils/groupPreviewProperties.js';
import { formatGroup } from '../utils/formatGroup.js';
import { userProperties } from '../utils/userProperties.js';

export async function getMessageGroupsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = { 
            members: {
                some: {
                    user: {
                        username: req.username
                    }
                }
            }
        };

        const select = groupPreviewProperties;
        const options = {
            orderBy: {
                createdAt: 'desc'
            }
        };

        const result = await getPaginatedData(
            where,
            select, 
            "messageGroup", 
            req.body.limit, 
            { groupID: req.body.cursor }, 
            "groupID", 
            options
        );

        const groups = result.next.map((x) => formatGroup(x));
        return {
            ...result,
            next: groups
        };
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

export async function leaveMessageGroupHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const groupMember = await prisma.groupMember.findUnique({
            select: { unreadMessages: true },
            where: {
                groupID_userID: {
                    groupID: req.params.groupID,
                    userID: req.userData.userID
                }
            }
        });

        await prisma.$transaction([
            prisma.groupMember.delete({
                where: {
                    groupID_userID: {
                        groupID: req.params.groupID,
                        userID: req.userData.userID
                    }
                }
            }),
            prisma.user.update({
                where: { userID: req.userData.userID },
                data: {
                    unreadMessages: { decrement: groupMember.unreadMessages }
                }
            })
        ]);
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("You are not in this group or the group does not exist.", 404);
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

export async function clearUnreadMessagesHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        return await prisma.$transaction(async (tx) => {
            const groupMember = await tx.groupMember.findUnique({
                select: { unreadMessages: true },
                where: {
                    groupID_userID: {
                        groupID: req.params.groupID,
                        userID: req.userData.userID
                    }
                }
            });

            await tx.groupMember.update({
                data: { unreadMessages: 0 },
                where: {
                    groupID_userID: {
                        groupID: req.params.groupID,
                        userID: req.userData.userID
                    }
                }
            });

            const updatedUser = await tx.user.update({
                select: { ...userProperties },
                where: { userID: req.userData.userID },
                data: {
                    unreadMessages: {
                        decrement: groupMember.unreadMessages
                    }
                }
            });

            return updatedUser;
        });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new DBError("You are not in this message group or it does not exist.", 404);
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}