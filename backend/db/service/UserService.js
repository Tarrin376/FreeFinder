import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from 'process';
import pkg from 'cloudinary';

const prisma = new PrismaClient();
const cloudinary = pkg.v2;

cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_secret: env.API_SECRET,
    api_key: env.API_KEY
});

export async function updateProfilePictureHandler(username, file) {
    const upload = cloudinary.uploader.upload(file, { public_id: `FreeFinder/ProfilePictures/${username}` });

    const success = await upload.then((data) => data)
    .catch((err) => {
        throw err;
    });

    try {
        await prisma.user.update({
            where: { username: username },
            data: { profilePicURL: success.secure_url }
        });
    }
    catch (err) {
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updatePasswordHandler(username, password) {
    const hash = await bcrypt.hash(password, 10);
    
    try {
        await prisma.user.update({
            where: { username: username },
            data: { hash: hash }
        });
    }
    catch (err) {
        throw err;
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
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                throw new Error("There already exists a user with this username or email address.");
            }
        }
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function findUserHandler(usernameOrEmail, password) {
    try {
        const res = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: usernameOrEmail },
                    { username: usernameOrEmail }
                ],
            },
        });
        
        if (!res) {
            throw new Error("Email or username provided doesn't have any account linked to it.");
        }

        const passwordMatch = await bcrypt.compare(password, res.hash);
        if (!passwordMatch) {
            throw new Error("Password entered is incorrect. Ensure that you have entered it correctly.");
        } else {
            const {hash, ...filtered} = res;
            return filtered;
        }
    }
    catch (err) {
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function updateUserHandler(username, data) {
    try {
        const updated = await prisma.user.update({
            where: { username: username },
            data: { ...data },
        });

        const {hash, password, ...res} = updated;
        return res;
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                throw new Error("There already exists a user with this username or email address.");
            }
        }
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function deleteUserHandler(username) {
    try {
        await prisma.user.delete({ where: { username: username } });
    }
    catch (err) {
        throw err;
    }
    finally {
        await prisma.$disconnect();
    }
}