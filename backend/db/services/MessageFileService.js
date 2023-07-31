import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { cloudinary } from '../index.js';

export async function addMessageFileHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const message = await prisma.message.findUnique({
            where: { messageID: req.messageID }
        });

        if (!message) {
            throw new DBError("Message not found.", 404);
        }

        const fileExtension = req.body.name.split('.').pop().toLowerCase();
        const result = await cloudinary.uploader.upload(req.body.file, { 
            folder: `FreeFinder/MessageFiles/${req.messageID}`,
            tags: [fileExtension],
            resource_type: "raw",
            public_id: req.body.name
        });

        const newFile = await prisma.messageFile.create({
            data: {
                messageID: req.messageID,
                url: result.secure_url,
                name: req.body.name,
                fileType: req.body.fileType,
                fileSize: req.body.fileSize,
            },
            select: {
                url: true,
                name: true,
                fileType: true,
                fileSize: true,
            }
        });

        return newFile;
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