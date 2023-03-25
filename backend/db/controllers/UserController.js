import 
{ 
    addUserHandler, 
    getUserHandler, 
    updateUserHandler, 
    updateProfilePictureHandler, 
    deleteUserHandler,
    updatePasswordHandler,
    getSavedPostsHandler
} 
from '../services/UserService.js';
import { cookieJwtSign } from '../middleware/cookieJwtSign.js';

export async function loginUser(req, res) {
    try {
        const user = await getUserHandler(req.body.usernameOrEmail, req.body.password);
        req.userData = user;

        const sign = await cookieJwtSign(req, res);
        return sign;
    }
    catch (err) {
        res.json({ message: err.message }).status(err.code);
    }
}

export async function logoutUser(_, res) {
    try {
        return res.clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out" });
    }
    catch (err) {
        res.json({ message: err.message }).status(400);
    }
}

export async function updateProfilePicture(req, res) {
    try {
        const updated = await updateProfilePictureHandler(req.body.userID, req.body.profilePic);
        req.userData = updated;

        const sign = await cookieJwtSign(req, res);
        return sign;
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

export async function getUser(req, res) {
    try {
        const user = await getUserHandler(req.body.usernameOrEmail, req.body.password);
        res.json({ userData: user });
    }
    catch (err) {
        res.json({ error: err.message });
    }
}

export async function updateUser(req, res) {
    try {
        const updated = await updateUserHandler(req.body);
        req.userData = updated;
        
        const sign = await cookieJwtSign(req, res);
        return sign;
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