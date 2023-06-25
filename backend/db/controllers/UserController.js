import 
{ 
    registerUserHandler, 
    getUserHandler, 
    updateUserHandler, 
    updateProfilePictureHandler, 
    deleteUserHandler,
    updatePasswordHandler,
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
        res.status(err.code).json({ message: err.message });
    }
}

export async function logoutUser(_, res) {
    try {
        return res.clearCookie("access_token").status(200).json({ message: "success" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateProfilePicture(req, res) {
    try {
        const updated = await updateProfilePictureHandler(req.userData.userID, req.body.profilePic);
        req.userData = updated;

        const sign = await cookieJwtSign(req, res);
        return sign;
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function registerUser(req, res) {
    try {
        await registerUserHandler(req.body);
        res.status(201).json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getUser(req, res) {
    try {
        const user = await getUserHandler(req.body.usernameOrEmail, req.body.password);
        res.json({ userData: user, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
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
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteUser(req, res) {
    try {
        await deleteUserHandler(req.userData.userID);
        return res.clearCookie("access_token").status(200).json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updatePassword(req, res) {
    try {
        await updatePasswordHandler(req.userData.userID, req.body.password);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}