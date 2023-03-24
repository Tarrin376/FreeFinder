import 
{ 
    addUserHandler, 
    findUserHandler, 
    updateUserHandler, 
    updateProfilePictureHandler, 
    deleteUserHandler,
    updatePasswordHandler,
    getSavedPostsHandler
} 
from '../services/UserService.js';
import { env } from 'process';
import jwt from 'jsonwebtoken';

export async function loginUser(req, res) {
    try {
        const user = await findUserHandler(req.body.usernameOrEmail, req.body.password);
        const token = jwt.sign({ ...user }, env.JWT_SECRET_KEY, { expiresIn: "1d" });

        return res.cookie("access_token", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production"
        })
        .json({ userData: user });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function logoutUser(req, res) {
    try {
        const token = req.cookies.access_token;
        if (token) {
            return res.clearCookie("access_token")
            .status(200)
            .json({ message: "Successfully logged out" });
        } else {
            return res.status(400).json({ message: "Unable to logout" });
        }
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function updateProfilePicture(req, res) {
    try {
        await updateProfilePictureHandler(req.body.userID, req.body.profilePic);
        res.json({ status: "success" });
    }
    catch (err) {
        res.json({ status: err.message });
    }
}

export async function addUser(req, res) {
    try {
        await addUserHandler(req.body);
        res.json({ status: "success" });
    }
    catch (err) {
        res.json({ status: err.message });
    }
}

export async function findUser(req, res) {
    try {
        const user = await findUserHandler(req.body.usernameOrEmail, req.body.password);
        res.json({ userData: user });
    }
    catch (err) {
        res.json({ error: err.message });
    }
}

export async function updateUser(req, res) {
    try {
        const updated = await updateUserHandler(req.body);
        res.json({ message: "success", userData: updated });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function deleteUser(req, res) {
    try {
        await deleteUserHandler(req.body.userID);
        res.json({ message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function updatePassword(req, res) {
    try {
        await updatePasswordHandler(req.body.userID, req.body.password);
        res.json({ message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}

export async function getSavedPosts(req, res) {
    try {
        const saved = await getSavedPostsHandler(req.body.userID, req.body.cursor, req.query.sort);
        res.json({ ...saved, message: "success" });
    }
    catch (err) {
        res.json({ message: err.message });
    }
}