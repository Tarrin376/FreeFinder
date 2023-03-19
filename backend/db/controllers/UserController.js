import 
{ 
    addUserHandler, 
    findUserHandler, 
    updateUserHandler, 
    updateProfilePictureHandler, 
    deleteUserHandler,
    updatePasswordHandler
} 
from '../services/UserService.js';

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
        const user = await findUserHandler(req.params.usernameOrEmail, req.body.password);
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