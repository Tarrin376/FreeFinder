import 
{ 
    registerUserHandler, 
    findUserHandler, 
    updateUserHandler, 
    updateProfilePictureHandler, 
    deleteUserHandler,
    updatePasswordHandler,
} 
from '../services/UserService.js';
import { cookieJwtSign } from '../middleware/cookieJwtSign.js';

export async function authenticateUser(req, res) {
    try {
        const user = await findUserHandler(req.body.usernameOrEmail, req.body.password);
        req.userData = user;

        const sign = await cookieJwtSign(req, res);
        return sign;
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteUserSession(_, res) {
    try {
        return res.clearCookie("access_token").json({ message: "success" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function updateProfilePicture(req, res) {
    try {
        const updated = await updateProfilePictureHandler(req);
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

export async function findUser(req, res) {
    try {
        await findUserHandler(req.params.usernameOrEmail, req.body.password);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updateUser(req, res) {
    try {
        const updated = await updateUserHandler(req);
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
        await deleteUserHandler(req);
        return res.clearCookie("access_token").json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function updatePassword(req, res) {
    try {
        await updatePasswordHandler(req);
        res.json({ message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}