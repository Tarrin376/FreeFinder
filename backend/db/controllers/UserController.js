import 
{ 
    registerUserHandler, 
    authenticateUserHandler, 
    updateUserHandler, 
    updateProfilePictureHandler, 
    deleteUserHandler,
    updatePasswordHandler,
    getUserPostsHandler,
    getBalanceHandler,
    addToBalanceHandler
} 
from '../services/UserService.js';
import { cookieJwtSign } from '../middleware/cookieJwtSign.js';

export async function authenticateUser(req, res) {
    try {
        const user = await authenticateUserHandler(req.body.usernameOrEmail, req.body.password);
        req.body = { status: "ONLINE" };
        req.userData = user;
        req.username = user.username;

        const setOnline = await updateUserHandler(req);
        req.userData = setOnline;

        const sign = await cookieJwtSign(req, res);
        return sign;
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function jwtAuthenticateUser(req, res) {
    try {
        req.body = { status: "ONLINE" };
        req.username = req.userData.username;

        const setOnline = await updateUserHandler(req);
        return res.json({ userData: setOnline });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function deleteUserSession(req, res) {
    try {
        req.body = { status: "OFFLINE" };
        req.username = req.userData.username;

        await updateUserHandler(req);
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
        await authenticateUserHandler(req.params.usernameOrEmail, req.body.password);
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

export async function getUserPosts(req, res) {
    try {
        const response = await getUserPostsHandler(req);
        res.json({...response, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function getBalance(req, res) {
    try {
        const balance = await getBalanceHandler(req);
        res.json({ balance: balance, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}

export async function addToBalance(req, res) {
    try {
        const balance = await addToBalanceHandler(req);
        res.json({ balance: balance, message: "success" });
    }
    catch (err) {
        res.status(err.code).json({ message: err.message });
    }
}