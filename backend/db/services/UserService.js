import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from 'process';
import pkg from 'cloudinary';
import { DBError } from '../customErrors/DBError.js';

export const prisma = new PrismaClient();
export const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY
});

export async function updateProfilePictureHandler(userID, image) {
    try {
        const user = await prisma.user.findUnique({ where: { userID: userID }});
        if (!user) {
            throw new DBError("User not found.", 404);
        }

        const upload = cloudinary.uploader.upload(image, { public_id: `FreeFinder/ProfilePictures/${userID}` });
        const success = await upload.then((data) => data);
        
        const updated = await prisma.user.update({
            where: { userID: userID },
            data: { profilePicURL: success.secure_url },
            include: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true
                    }
                },
            }
        });

        const {hash, password, ...res} = updated;
        return res;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 413) {
            throw new DBError("Error updating profile picture: File size exceeds limit.", 413);
        } else {
            throw new DBError("Something went wrong when trying to update your profile picture. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updatePasswordHandler(userID, password) {
    const hash = await bcrypt.hash(password, 10);
    
    try {
        await prisma.user.update({
            where: { userID: userID },
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
            throw new DBError("Something went wrong when trying to update your password. Please try again.", 500)
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
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("There already exists a user with this username or email address.", 409)
        } else {
            throw new DBError("Something went wrong when trying to register you. Please try again.", 500)
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function getUserHandler(usernameOrEmail, password) {
    try {
        const res = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: usernameOrEmail },
                    { username: usernameOrEmail }
                ],
            },
            include: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true,
                    }
                },
            }
        });
        
        if (!res) {
            throw new DBError("Email or username provided doesn't have any account linked to it.", 400);
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            throw new DBError("Password entered is incorrect. Ensure that you have entered it correctly.", 403)
        } else {
            const {hash, ...filtered} = res;
            return filtered;
        }
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } else {
            throw new DBError("Something went wrong when trying to get this user. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateUserHandler(data) {
    const {seller, ...res} = data;
    const userData = res;
    
    try {
        const updated = await prisma.user.update({
            where: { userID: userData.userID },
            data: { ...userData },
            include: {
                seller: {
                    select: {
                        description: true,
                        rating: true,
                        sellerID: true
                    }
                },
            }
        });

        const {hash, password, ...filtered} = updated;
        return filtered;
    }
    catch (err) {
        if (err instanceof DBError) {
            throw err;
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new DBError("Missing required fields or fields provided are invalid.", 400);
        } if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new DBError("There already exists a user with this username or email address.", 409);
        } else {
            throw new DBError("Something went wrong when trying update this user. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteUserHandler(userID) {
    try {
        await prisma.user.delete({ 
            where: { 
                userID: userID 
            } 
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
            throw new DBError("Something went wrong when trying to delete this user. Please try again.", 500);
        }
    }
    finally {
        await prisma.$disconnect();
    }
}