import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { cloudinary } from '../index.js';
import { MAX_FILE_BYTES, MAX_MESSAGE_FILE_UPLOADS } from '@freefinder/shared/dist/constants.js';

export async function addMessageFileHandler(req) {
    try {
        await checkUser(req.userData.userID, req.username);
        const message = await prisma.message.findUnique({
            where: { messageID: req.messageID },
            include: { files: true }
        });

        if (!message) {
            throw new DBError("Message not found.", 404);
        }  else if (message.files.length === MAX_MESSAGE_FILE_UPLOADS) {
            throw new DBError(`You cannot send more than ${MAX_MESSAGE_FILE_UPLOADS} files in one message.`, 400);
        }

        const fileExtension = req.body.name.split('.').pop().toLowerCase();
        const result = await cloudinary.uploader.upload(req.body.file, { 
            folder: `FreeFinder/MessageFiles/${message.groupID}/${req.messageID}`,
            tags: [fileExtension],
            resource_type: "raw",
            public_id: req.body.name,
            max_bytes: MAX_FILE_BYTES
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
            throw new DBError("Something went wrong. Please try again later.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}