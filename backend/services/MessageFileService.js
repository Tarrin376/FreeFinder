import { Prisma } from '@prisma/client';
import { prisma } from '../index.js';
import { DBError } from '../customErrors/DBError.js';
import { checkUser } from '../utils/checkUser.js';
import { MAX_MESSAGE_FILE_UPLOADS, MAX_FILE_BYTES } from '@freefinder/shared/dist/constants.js';
import { uploadFile } from '../utils/uploadFile.js';

export async function addMessageFileHandler(req) {
    try {
        if (req.file == null) {
            throw new DBError("File not provided.", 400);
        }
        
        await checkUser(req.userData.userID, req.username);
        const message = await prisma.message.findUnique({
            where: { messageID: req.messageID },
            include: { files: true }
        });

        if (message == null) {
            throw new DBError("Message not found.", 404);
        }  else if (message.files.length === MAX_MESSAGE_FILE_UPLOADS) {
            throw new DBError(`You cannot send more than ${MAX_MESSAGE_FILE_UPLOADS} files in one message.`, 400);
        }

        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        const result = await uploadFile(
            req.file, 
            `FreeFinder/MessageFiles/${message.groupID}/${req.messageID}/${req.file.originalname}`, 
            MAX_FILE_BYTES,
            req.file.mimetype.startsWith("image/"),
            [fileExtension]
        );

        const newFile = await prisma.messageFile.create({
            data: {
                messageID: req.messageID,
                url: result.secure_url,
                name: req.file.originalname,
                fileType: fileExtension,
                fileSize: req.file.size
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