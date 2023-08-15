import { Prisma } from '@prisma/client';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { prisma } from '../index.js';
import { getPaginatedData } from '../utils/getPaginatedData.js';
import { notificationProperties } from '../utils/notificationProperties.js';

export async function getNotificationsHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const where = { userID: req.userData.userID };
        const select = notificationProperties;

        const options = {
            orderBy: {
                createdAt: 'desc'
            }
        };

        const result = await getPaginatedData(
            where, 
            select, 
            "notification", 
            req.body.limit, 
            { notificationID: req.body.cursor }, 
            "notificationID", 
            options
        );

        return result;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}

export async function updateToReadHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        const notification = await prisma.notification.findUnique({
            where: { notificationID: req.params.id },
            select: { userID: true }
        });

        if (!notification) {
            throw new DBError("Notification not found.", 404);
        } else if (notification.userID !== req.userData.userID) {
            throw new DBError("You do not have permission to update this notification.", 403);
        }

        await prisma.$transaction([
            prisma.notification.update({
                where: { notificationID: req.params.id },
                data: { unread: false }
            }),
            prisma.user.update({
                where: { userID: req.userData.userID },
                data: {
                    unreadNotifications: { decrement: 1 }
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
}

export async function updateAllToReadHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);

        await prisma.$transaction([
            prisma.notification.updateMany({
                where: { userID: req.userData.userID },
                data: { unread: false }
            }),
            prisma.user.update({
                where: { userID: req.userData.userID },
                data: { unreadNotifications: 0 }
            })
        ]);
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else {
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
}