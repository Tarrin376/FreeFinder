import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from 'process';
import pkg from 'cloudinary';

export const prisma = new PrismaClient();
const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_secret: env.CLOUDINARY_API_SECRET,
    api_key: env.CLOUDINARY_API_KEY
});

export async function updateProfilePictureHandler(userID, file) {
    const upload = cloudinary.uploader.upload(file, { public_id: `FreeFinder/ProfilePictures/${userID}` });
    
    const success = await upload.then((data) => data)
    .catch((err) => {
        throw err;
    });

    try {
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
        const error = new Error("Something went wrong when trying to process your request. Please try again.");
        error.code = 400;
        throw error;
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
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            const error = new Error("User could not be found.");
            error.code = 404;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function addUserHandler(userData) {
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
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            const error = new Error("There already exists a user with this username or email address.");
            error.code = 409;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
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
            const error = new Error("Email or username provided doesn't have any account linked to it.");
            error.code = 400;
            throw error;
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            const error = new Error("Password entered is incorrect. Ensure that you have entered it correctly.");
            error.code = 403;
            throw error;
        } else {
            const {hash, ...filtered} = res;
            return filtered;
        }
    }
    catch (err) {
        if (!err.code) {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
        } else {
            throw err;
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

        const {hash, password, ...res} = updated;
        return res;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            const error = new Error("There already exists a user with this username or email address.");
            error.code = 409;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
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
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            const error = new Error("User not found");
            error.code = 404;
            throw error;
        } else {
            const error = new Error("Something went wrong when trying to process your request. Please try again.");
            error.code = 400;
            throw error;
        }
    }
    finally {
        await prisma.$disconnect();
    }
}