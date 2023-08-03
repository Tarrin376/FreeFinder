import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { groupPreviewProperties } from '../utils/groupPreviewProperties.js';
import { formatGroup } from '../utils/formatGroup.js';

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

        const groups = result.next.map((x) => formatGroup(x.group));
        return {
            ...result,
            next: groups
        }
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}